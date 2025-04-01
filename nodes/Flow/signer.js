import * as fcl from '@onflow/fcl';
import elliptic from 'elliptic';
import { SHA3 } from 'sha3';

export class Signer {
	constructor(privateKey) {
		this.privateKey = privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey;
	}

	/**
	 * Hash a message
	 */
	hashMsg(msg) {
		const sha = new SHA3(256);
		sha.update(Buffer.from(msg, 'hex'));
		return sha.digest();
	}

	/**
	 * Sign a message with a private key
	 */
	signWithKey(msg) {
		const ec = new elliptic.ec('p256');
		const key = ec.keyFromPrivate(Buffer.from(this.privateKey, 'hex'));
		const sig = key.sign(this.hashMsg(msg));
		const n = 32;
		const r = sig.r.toArrayLike(Buffer, 'be', n);
		const s = sig.s.toArrayLike(Buffer, 'be', n);
		return Buffer.concat([r.valueOf(), s.valueOf()]).toString('hex');
	}
}
