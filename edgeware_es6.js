const { ApiPromise, WsProvider } = require('@polkadot/api');
const util = require("@polkadot/util-crypto");
import {
	isWeb3Injected,
	web3Accounts,
	web3Enable,
	web3FromSource,
	web3FromAddress
} from "@polkadot/extension-dapp";
web3Enable('polkadot-js/apps');


class EdgewareWeb3JS {
	
	
	
	/***
	 * returnEdgewareAddress
	 * From Polkadot address to Edgeware address
	 * From 5D2JMakX2CgtPPkiqUzdsK3Y41vD6HyNy8ZETUjhjRrZFTfG to hhWb3maNpMm2hprDkw3ZXQ7nKp9UsSmKG7qXrDUuLnKGVkZ
	 * @return {"address":"hhWb3maNpMm2hprDkw3ZXQ7nKp9UsSmKG7qXrDUuLnKGVkZ"}
     *
	 */
	
	async returnEdgewareAddress(from) {
		let decoded = util.decodeAddress(from);
		return util.encodeAddress(from, 7);
	}
	
	
	/***
	 * login / show edgeware account
	 * @return accounts [{"address":"5CFbdmigpzyCVkz5vPisn4hzQJpSQHUyvBWS4mj27GbP7itQ","meta":{"name":"cc1","source":"polkadot-js"}}]

	 */
	async loginEdgeware() {
		if (!isWeb3Injected) {
			throw new Error("Please install/unlock the MathWallet first");
		}
		// meta.source contains the name of the extension that provides this account
		const allAccounts = await web3Accounts();
		return allAccounts;
	}	
	

/***
	 * getBalance(from)
	 * From Edgeware address
	 * return balance on EDG
	 * @return number
     *
	 */
	
	async getBalance(from) {
		// other node seems not stable
		const provider = new WsProvider('wss://mainnet1.edgewa.re/');
		// Create the API and wait until ready
		const api = await ApiPromise.create({ provider });			
		
		let balance1 ;
		let { data: { free: previousFree }, nonce: previousNonce } = await api.query.system.account(from);
		let account = await api.query.system.account(from);
		balance1 = account.data.free.toHuman();
		console.log(balance1);
		return balance1;
		
	}
	
	

	/***
	 * Transfer
	 * @param from from
	 * @param to to
	 * @param amount amount
	 * @return hash
	 */
	async transfer(from, to, amount) {				
		
		const wsAddress = 'wss://mainnet1.edgewa.re';		
		const wprovider = new WsProvider(wsAddress);
		
		const api = await ApiPromise.create({
			provider: wprovider,						
			types: {    
				// chain-specific overrides
				Address: "IndicesLookupSource", 
				LookupSource: "IndicesLookupSource",	 
				Balance: 'u256'
			}
		});


		// finds an injector for an address
		const injector = await web3FromAddress(from);
		const decimals = api.registry.chainDecimals;
		const h = await api.tx.balances
		.transfer(to, (BigInt(amount * (10 ** decimals))))
		.signAndSend(from, { signer: injector.signer }, (status) => {			
		});	
		
		return h;
	}
}
window.EdgewareWeb3JS = new EdgewareWeb3JS();