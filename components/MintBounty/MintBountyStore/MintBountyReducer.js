const MintBountyReducer = (state, action) => {
	const reducedState = {
		...state,
		...action
	};

	/* Enable mint button when:
- Issue URL is valid
- Issue is found (organization, repository, and issue number all exist)
- Issue is not already closed on GitHub
- A bounty has not already been minted for the provided GitHub issue
- A bounty wasn't just minted since opening the modal
- Transaction is not pending
*/

	const { issueFound, issueClosed, isValidUrl, bountyExists, transactionPending, isBountyMinted } = reducedState;

	let enableMint = isValidUrl && !issueClosed && issueFound && !bountyExists && !transactionPending && !isBountyMinted;

	return { ...reducedState, enableMint };
};

export default MintBountyReducer;