const BeeJs = require('@ethersphere/bee-js')
const MantarayJs = require('mantaray-js')

/**
 * The character `/`
 */
const INDEX_DOCUMENT_FORK_PREFIX = '47'

class SwarmManifestList {
    /**
     * @param {BeeJs.Bee} bee
     */
    constructor(bee) {
        this.bee = bee
    }

    /**
     * @param {string} hash Swarm hash
     * @returns {Promise<boolean>} Whether the hash is a manifest
     */
    async isManifest(hash) {
        try {
            const data = await this.bee.downloadData(hash)
            const node = new MantarayJs.MantarayNode()
            node.deserialize(data)
            return true
        } catch {
            return false
        }
    }

    /**
     * @param {string} hash Swarm hash
     * @returns {Promise<string | null>} Path of the index document if set, or `null`
     */
    async getIndexDocument(hash) {
        const data = await this.bee.downloadData(hash)
        const node = new MantarayJs.MantarayNode()
        node.deserialize(data)
        if (!node.forks) {
            return null
        }
        const fork = node.forks[INDEX_DOCUMENT_FORK_PREFIX]
        if (!fork) {
            return null
        }
        const metadataNode = fork.node
        if (!metadataNode.IsWithMetadataType()) {
            return null
        }
        const metadata = metadataNode.getMetadata
        if (!metadata) {
            return null
        }
        return metadata['website-index-document'] || null
    }

    /**
     * @param {string} hash Swarm hash
     * @returns {Promise<object>} Object of `[path]: [hash]` pairs
     */
    async getHashes(hash) {
        const data = await this.bee.downloadData(hash)
        const node = new MantarayJs.MantarayNode()
        node.deserialize(data)
        await MantarayJs.loadAllNodes(load.bind(this), node)
        const result = {}
        extractHashes(result, node)
        return result
    }
}

/**
 * @param {object} result
 * @param {MantarayJs.MantarayNode} node
 * @param {string} prefix
 * @returns {void}
 */
function extractHashes(result, node, prefix = '') {
    for (const fork of Object.values(node.forks)) {
        const path = prefix + bytesToUtf8(fork.prefix)
        const childNode = fork.node
        if (childNode.isValueType() && path !== '/') {
            result[path] = bytesToHex(childNode.getEntry)
        }
        if (childNode.isEdgeType()) {
            extractHashes(result, childNode, path)
        }
    }
}

/**
 * @param {Uint8Array} reference
 */
async function load(reference) {
    return this.bee.downloadData(bytesToHex(reference))
}

/**
 * @param {Uint8Array} bytes
 * @returns {string} Hex string of the bytes
 */
function bytesToHex(bytes) {
    return Buffer.from(bytes).toString('hex')
}

/**
 * @param {Uint8Array} bytes
 * @returns {string} UTF-8 string of the bytes
 */
function bytesToUtf8(bytes) {
    return Buffer.from(bytes).toString('utf-8')
}

module.exports = { SwarmManifestList }
