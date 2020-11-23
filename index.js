import { ThreeIdConnect, EthereumAuthProvider } from './node_modules/3id-connect/src/index';
import Ceramic from '@ceramicnetwork/ceramic-http-client'
// import IPFS from 'ipfs'
import web3Modal from './providers.js'
import appSchema from './schema'
import { SkynetClient, keyPairFromSeed } from 'skynet-js'
import { DID } from 'dids'
import { createSolutionBuilderWithWatchHost } from 'typescript';


window.keyPairFromSeed = keyPairFromSeed
window.skynet = new SkynetClient('https://siasky.net')
window.DID = DID
window.ceramic = new Ceramic('https://ceramic.3boxlabs.com')

// const ipfs = await IPFS.create()
// const ceramic = await Ceramic.create(ipfs, { didProvider })
const THREEID_CONNECT_URL = 'http://localhost:30001' /*https://3idconnect.org/index.html";*/


const threeIdConnect = new ThreeIdConnect(THREEID_CONNECT_URL)
let ethAddress


const authenticate = async () => {
   const ethProvider = await web3Modal.connect()
   const addresses = await ethProvider.enable()

   let ethAddress = addresses[0]
   const authProvider = new EthereumAuthProvider(ethProvider, ethAddress)
   await threeIdConnect.connect(authProvider)// create a Ceramic instance

   const didProvider = await threeIdConnect.getDidProvider()
   const did = new DID({ provider: didProvider })

   await did.authenticate()
   console.log("This is the did "+ did.id)

   const jws = await did.createJWS({ id: did })
   console.log(jws)
}


// this shit makes sense... its just making a document to eventually add to skydb
const schemaID = await publishSchema(Ceramic, { content: appSchema })

const definitionID = await Ceramic.createDefinition(ceramic, { 
      name: "userProfile",
      description: "Users profile information",
      schema: schemaID.toUrl('base36')
   })
const seedKey = definitionID.toString()
console.log('IDX setup created with definition ID:', seedKey)

//   // format to updatea a document
//   await doc3.change({
//     content: {
//       title: 'Client Document',
//       description: 'This document has now been updated from the browser'
//     }
//   })

bauth.addEventListener('click', authenticate)