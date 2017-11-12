# BeefTrace
BeefTrace is a blockchain solution for the meat supply chain. It main value proposition is to enforce a controlled and monitored operation every time a piece of meat is split. Basically, every time a meat is split, there is a risk that other materials or even lower quality meat is mixed with the original piece. This can happen both untainted and on purpose to increase profits. Our solution requires that each cut of the meat happens on top of a scale and is monitorizar by a camera. Each cut done to the meat, is then automatically computed by the scale which generate a hash for the new piece. This follow a simple rule. The weight of the sliced meats, can not be higher than the original piece. This way we increase the security of the traceability of our blockchain.

The project has 3 folders:

* BullChain - the chain code used in the project to be deployed in a Hyperledger
* ScaleAndroidApp - The android app is responsible to communicate and interact with the Scale and to send its data to the Node-Red Server.
* Node-RedIntegration - This is the integration components which links the Android application with the blockchain chaincode.
