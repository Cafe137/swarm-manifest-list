const BeeJs = require('@ethersphere/bee-js')
const { SwarmManifestList } = require('.')

async function main() {
    const swarmHash = process.argv[2]
    const list = new SwarmManifestList(new BeeJs.Bee('http://localhost:1633'))
    const acceptable = await list.isManifest(swarmHash)
    if (acceptable) {
        console.log(await list.getIndexDocument(swarmHash))
        console.log(await list.getHashes(swarmHash))
    } else {
        console.log('ERROR')
    }
}

main()
