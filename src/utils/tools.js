export const tools = {

	getToken() {
		const remember = localStorage.getItem('remember') === 'true';
		return remember
		    ? localStorage.getItem('token')
		    : sessionStorage.getItem('token');
	},
};