const BeeJs = require('@ethersphere/bee-js')
const { SwarmManifestList } = require('.')

async function main() {
    const list = new SwarmManifestList(new BeeJs.Bee('http://localhost:1633'))
    const acceptable = await list.isManifest(process.argv[2])
    if (acceptable) {
        console.log(await list.getHashes(process.argv[2]))
    } else {
        console.log('ERROR')
    }
}

main()
