/*
 * [RsaUtils.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/2/15 21:38
 *
 */

// rsaEncryptor.js
import JSEncrypt from 'jsencrypt';

/**
 * RSA 加密工具类（兼容 Java 后端 PKCS1Padding）
 */
class RsaEncryptor {
	/**
	 * 使用 Base64 编码的公钥对明文进行 RSA 加密
	 * @param {string} plaintext - 要加密的明文（如密码）
	 * @param {string} publicKeyBase64 - 后端提供的 Base64 编码的公钥（PKCS#8 格式？注意：JSEncrypt 需要 PKCS#1 格式的公钥）
	 * @returns {string} Base64 编码的密文
	 */
	static encrypt(plaintext, publicKeyBase64) {
		if (!plaintext || !publicKeyBase64) {
			throw new Error('明文或公钥不能为空');
		}

		//Java 生成的公钥是 X.509 SubjectPublicKeyInfo 格式（PKCS#8 公钥结构）
		// JSEncrypt 只接受 PKCS#1 格式的公钥（即以 -----BEGIN RSA PUBLIC KEY----- 开头）
		// 但幸运的是，JSEncrypt 内部可以自动处理 X.509 格式的公钥（以 -----BEGIN PUBLIC KEY----- 开头）
		// 所以我们只需将 Base64 转为 PEM 格式即可


		const pemPublicKey = RsaEncryptor.base64ToPem(publicKeyBase64, 'PUBLIC KEY');

		const encryptor = new JSEncrypt();
		encryptor.setPublicKey(pemPublicKey);

		const encrypted = encryptor.encrypt(plaintext);
		
		if (!encrypted) {
			throw new Error('RSA 加密失败，请检查公钥格式或明文长度');
		}

		return encrypted; // JSEncrypt.encrypt() 返回的就是 Base64 字符串
	}

	/**
	 * 将 Base64 编码的密钥转换为 PEM 格式
	 * @param {string} base64Key
	 * @param {string} keyType - 'PUBLIC KEY' 或 'RSA PRIVATE KEY' 等
	 * @returns {string} PEM 格式的密钥
	 */
	static base64ToPem(base64Key, keyType) {
		const lines = [];
		const key = base64Key.replace(/\s/g, ''); // 去除空格
		const prefix = `-----BEGIN ${keyType}-----\n`;
		const suffix = `\n-----END ${keyType}-----`;

		// 每 64 个字符一行（PEM 标准）
		for (let i = 0; i < key.length; i += 64) {
			lines.push(key.substring(i, i + 64));
		}

		return prefix + lines.join('\n') + suffix;
	}
}

export default RsaEncryptor;