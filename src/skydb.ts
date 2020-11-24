import { createDefinition, publishSchema } from '@ceramicstudio/idx-tools'
import type { JWE } from 'did-jwt'
import type { DID } from 'dids'
import { SkynetClient, keyPairFromSeed } from 'skynet-js'
// @ts-ignore
import { fromString, toString } from 'uint8arrays'

import { createCeramic } from './ceramic'
import { createIDX } from './idx'
import { getAuthProvider } from './wallet'

window.keyPairFromSeed = keyPairFromSeed
window.skynet = new SkynetClient('https://siasky.net')

declare global {
  interface Window {
    did?: DID
    keyPairFromSeed: typeof keyPairFromSeed
    skynet: SkynetClient
  }
}

import appSchema from "./schema.json"
// const err = validateSchema( {compile: appSchema, validate:{"userName":"jhkl"} })
// if (err) {
//   console.log("Success " + err)
// } else {
//   console.log("You done goofed " + err)
// }
// console.log(appSchema)

console.log("1")
const ceramicPromise = createCeramic()
console.log("2")

const authenticate = async (): Promise<void> => {
  console.log('Authenticating...')

  const [authProvider, ceramic] = await Promise.all([getAuthProvider(), ceramicPromise])
  console.log("3")
  const idx = await createIDX(ceramic, { authProvider })
  console.log("4: idx " + idx.did)
  // const ceramic = await ceramicPromise
  // const wallet = await Wallet.create({
  //   ceramic,
  //   seed: fromString('5608217256c8920568c7d44a27486411e5559e58f3017c41f39e3ce69ef2f728'),
  //   getPermission() {
  //     return Promise.resolve([])
  //   },
  // })
  // const idx = await createIDX(ceramic, { provider: wallet.getDidProvider() })

  window.did = idx.did

  console.log("5")
  console.log('Authenticated with DID:', idx.did)
  console.log('Creating IDX setup...')

  // @ts-ignore
  const schemaID = await publishSchema(ceramic, { content: appSchema })
  console.log("schemaID" + schemaID)

  const definitionID = await createDefinition(ceramic, {
    name: 'Dedo',
    description: 'userProfile',
    schema: schemaID.toUrl('base36'),
  })
  const seedKey = definitionID.toString()
  console.log('IDX setup created with definition ID:', seedKey)

  const createKeyPair = async (seed: string): Promise<ReturnType<typeof keyPairFromSeed>> => {
    const jwe = await idx.did.createJWE(fromString(seed), [idx.id])
    await idx.set(seedKey, jwe)
    return keyPairFromSeed(seed)
  }
  // @ts-ignore
  window.createKeyPair = createKeyPair

  const loadKeyPair = async (): Promise<ReturnType<typeof keyPairFromSeed> | null> => {
    const jwe = await idx.get<JWE>(seedKey)
    if (jwe == null) {
      return null
    }
    const decrypted = await idx.did.decryptJWE(jwe)
    return keyPairFromSeed(toString(decrypted))
  }
  // @ts-ignore
  window.loadKeyPair = loadKeyPair

  console.log('Next steps:')
  console.log(
    'Run `kp = await createKeyPair("my seed phrase")` to save your seed with IDX and create the SkyDB key pair'
  )
  console.log(
    'You can then run `kp = await loadKeyPair()` to retrieve the saved seed and create the SkyDB key pair'
  )
  console.log(
    'Run `await skynet.db.setJSON(kp.privateKey, "hello", {hello: "SkyDB with IDX"})` to save data in SkyDB'
  )
  console.log(
    'You can then run `await skynet.db.getJSON(kp.publicKey, "hello")` to load the saved data'
  )
}

document.getElementById('bauth')?.addEventListener('click', () => {
  authenticate().catch((err) => {
    console.error('Failed to authenticate:', err)
  })
})
