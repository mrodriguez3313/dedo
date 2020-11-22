// Export the created `appSchema` so they can be used at runtime
export const appSchema =  {
    "$schema": 'http://json-schema.org/draft-07/schema#',
    "title": 'DedoProfile',
    "type": 'object',
    "definitions": {
        "IPFSUrl": {
          "type": "string",
          "pattern": "^ipfs://.+",
          "maxLength": 150
        },
        "videoMetaData": {
            "type": "object",
            "properties": {
                "$ref": "#/definitions/IPFSUrl",
                "dateUploaded": {
                    "type":'string',
                    "format":"date"
                },
                "fileType": {
                    "type":'string',
                    "maxLength": 8
                },
                "videoDescription": {
                    "type": "string",
                    "maxLength": 300
                },
                "videoLength": {
                    "type":"string",
                    "maxLength": 8
                },
                "videoSize":{
                    "type":"number"
                }
            }
        }
      },
    "properties": {
        "userName": {
            "type":'string',
            "maxLength": 16
        },
        "password": {
            "type":'string',
            "maxLength": 64
        },
        "image": {
            "$ref": "#/definitions/IPFSUrl"
        },
        "dateCreated": {
            "type":'string',
            "format":"date"
        },
        "Videos": {
            "type": "array",
            "items" : {
                "type":{
                    "$ref":"#/$definitions/videoMetaData"
                }
            }
        },
        "required":["userName","password"]
    }
};
