// Third party
import React, { useEffect, useState, useContext, useRef } from 'react';
import { useRouter } from 'next/router';

// Custom
import useWeb3 from '../../hooks/useWeb3';
import StoreContext from '../../store/Store/StoreContext';
import BountyAlreadyMintedMessage from './BountyAlreadyMintedMessage';
import ToolTipNew from '../Utils/ToolTipNew';
import MintBountyModalButton from './MintBountyModalButton';
import MintBountyHeader from './MintBountyHeader';
import MintBountyInput from './MintBountyInput';
import ErrorModal from '../ConfirmErrorSuccessModals/ErrorModal';
import useIsOnCorrectNetwork from '../../hooks/useIsOnCorrectNetwork';

const MintBountyModal = ({ modalVisibility, type }) => {
	// Context
	const [appState, dispatch] = useContext(StoreContext);
	const { library, account } = useWeb3();
	const router = useRouter();

	// State
	const [isOnCorrectNetwork] = useIsOnCorrectNetwork();
	const [issue, setIssue] = useState();
	const [url, setUrl] = useState('');
	const [bountyAddress, setBountyAddress] = useState();
	const [isLoading, setIsLoading] = useState();
	const [error, setError] = useState();
	const [claimed, setClaimed] = useState();
	const [enableMint, setEnableMint] = useState();
	const isValidUrl = appState.utils.issurUrlRegex(url);

	// Refs
	const modal = useRef();

	const setIssueUrl = async (issueUrl) => {
		if (!isLoading) {
			setEnableMint();
			let didCancel = false;
			setUrl(issueUrl);
			let issueUrlIsValid = appState.utils.issurUrlRegex(issueUrl);
			if (issueUrlIsValid && !didCancel) {

				async function fetchIssue() {
					try {
						const data = await appState.githubRepository.fetchIssueByUrl(issueUrl);
						if (!didCancel) {
							setIssue(data);
						}
						return data;
					} catch (error) {
						if (!didCancel) {
							setIssue(false);
						}
					}
				}
				const issueData = await fetchIssue();

				if (issueData) {

					try {
						let bounty = await appState.openQSubgraphClient.getBountyByGithubId(
							issueData.id,
						);
						setClaimed(bounty.status === 'CLOSED');
						if (bounty) {
							setBountyAddress(bounty.bountyAddress);
						}

					} catch (error) {
						setEnableMint(true);
						setBountyAddress();
					}
				}

			}
			return (() => {
				didCancel = true;
			});
		}
	};

	const mintBounty = async () => {
		try {
			setIsLoading(true);
			const { bountyAddress } = await appState.openQClient.mintBounty(
				library,
				issue.id,
				issue.repository.owner.id,
			);
			sessionStorage.setItem('justMinted', true);
			router.push(
				`${process.env.NEXT_PUBLIC_BASE_URL}/bounty/${issue.id}/${bountyAddress}`
			);
		} catch (error) {
			console.log('error in mintbounty', error);
			const { message, title } = appState.openQClient.handleError(error);
			console.log(message);
			setError({ message, title });

		}
	};

	const connectWallet = () => {
		const payload = {
			type: 'CONNECT_WALLET',
			payload: true
		};
		dispatch(payload);
	};

	const closeModal = () => {
		setIssue();
		setUrl();
		setBountyAddress();
		setIsLoading();
		setError();
		modalVisibility(false);
	};

	useEffect(() => {
		// Courtesy of https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
		function handleClickOutside(event) {
			if (modal.current && !modal.current.contains(event.target) && !appState.walletConnectModal && !document.getElementById('connect-modal')?.contains(event.target)) {
				modalVisibility(false);
			}
		}

		// Bind the event listener
		if (!isLoading) {
			document.addEventListener('mousedown', handleClickOutside);
		}
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [modal, isLoading]);

	// Render
	return (
		<div className={`justify-center items-center mx-4 overflow-x-hidden overflow-y-auto fixed inset-0 outline-none z-50 focus:outline-none p-10 ${appState.walletConnectModal ? 'hidden' : 'flex'}`}>
			{error ?
				<ErrorModal
					setShowErrorModal={closeModal}
					error={error}
				/> :
				<>
					<div ref={modal} className="min-w-[320px] space-y-5 z-50 ">
						<div className="w-full">
							<div className="border-0 rounded-sm shadow-lg flex flex-col bg-[#161B22] outline-none focus:outline-none z-11">
								<MintBountyHeader type={type}/>
								<div className="flex flex-col items-center pl-6 pr-6 space-y-2">
									<MintBountyInput
										setIssueUrl={setIssueUrl}
										issueData={issue}
										url={url}
										isValidUrl={isValidUrl}
									/>
								</div>
								{isValidUrl && !issue &&
									<div className="flex flex-col items-center pt-5 ">
										Github Issue not found
									</div>}
								<div className="flex flex-col items-center space-x-1 px-8">
									{isValidUrl && issue?.closed && !bountyAddress &&
										<div className="text-center pt-3 ">
											This issue is already closed on GitHub
										</div>}
									{isValidUrl && bountyAddress && issue &&
										<BountyAlreadyMintedMessage claimed={claimed} id={issue.id} bountyAddress={bountyAddress} />}
								</div>

								<div className="p-5 w-full">
									<ToolTipNew
										outerStyles={''}
										hideToolTip={(enableMint && isOnCorrectNetwork && !issue?.closed && account) || isLoading}
										toolTipText={
											account && isOnCorrectNetwork ?
												'Please choose an elgible issue.' :
												isOnCorrectNetwork ?
													'Connect your wallet to mint a bounty!' :
													'Please switch to the correct network to mint a bounty.'
										}>

										<MintBountyModalButton
											mintBounty={(account) ? mintBounty : connectWallet}
											account={account}
											enableMint={(enableMint && isOnCorrectNetwork && !issue?.closed && !isLoading) || !account}
											transactionPending={isLoading}
										/>

									</ToolTipNew>
								</div>
							</div>
						</div>
					</div>
					<div className="bg-overlay fixed inset-0 z-10"></div>
				</>}
		</div>
	);
};

export default MintBountyModal;
