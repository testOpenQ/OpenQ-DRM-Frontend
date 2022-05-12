import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { GET_PAGINATED_TVLS, CREATE_NEW_BOUNTY, UPDATE_BOUNTY, WATCH_BOUNTY, UNWATCH_BOUNTY, GET_BOUNTY_BY_HASH, GET_USER_BY_HASH } from './graphql/query';
import fetch from 'cross-fetch';

class OpenQPrismaClient {
	constructor() { }

	httpLink = new HttpLink({ uri: 'http://localhost:4000', fetch });

	client = new ApolloClient({
		uri: 'http://localhost:4000/graphql',
		link: this.httpLink,
		cache: new InMemoryCache(),
	});


	async getPaginatedTVLS( orderBy, limit, sortOrder, cursor) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_PAGINATED_TVLS,
					variables: { orderBy, limit, sortOrder, cursor }
				});
				resolve(result.data.organization);
			} catch (e) {
				reject(e);
			}
		});
		return promise;
	}

	async createNewBounty(id) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.mutate({
					mutation: CREATE_NEW_BOUNTY,
					variables: { id, tvl:0.0 }
				});
				resolve(result);
			} catch (e) {
				reject(e);
			}
		});
		return promise;
	}

	async updateBounty(id, tvl ) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.mutate({
					mutation: UPDATE_BOUNTY,
					variables: { id, tvl }
				});
				resolve(result.data.organization);
			} catch (e) {
				reject(e);
			}
		});
		return promise;
	}

	async watchBounty(contractAddress, userAddress ) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				console.log(contractAddress, userAddress);
				const result = await this.client.mutate({
					mutation: WATCH_BOUNTY,
					variables: { contractAddress, userAddress }
				});
				resolve(result.data.organization);
			} catch (e) {
				reject(e);
			}
		});
		return promise;
	}

	async unWatchBounty(contractAddress, userAddress ) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.mutate({
					mutation: UNWATCH_BOUNTY,
					variables: { contractAddress, userAddress }
				});
				resolve(result.data.organization);
			} catch (e) {
				reject(e);
			}
		});
		return promise;
	}


	async getBounty(contractAddress) {
		console.log('radical');
		const promise = new Promise(async (resolve, reject)=>{
			try {
				console.log(contractAddress);
				const result = await this.client.query({
					query: GET_BOUNTY_BY_HASH,
					variables: { contractAddress }
				});
				resolve(result.data.bounty);
			}
			catch(e){
				reject(e);
			}
		}
		);
		return promise;
	}
	async getUser(userAddress) {
		const promise = new Promise(async (resolve, reject)=>{
			try {
				const result = await this.client.query({
					query: GET_USER_BY_HASH,
					variables: { userAddress }
				});
				resolve(result.data);
			}
			catch(e){
				reject(e);
			}
		}
		);
		return promise;
	}
}

export default OpenQPrismaClient;