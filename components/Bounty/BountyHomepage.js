// Third Party
import React, { useEffect, useState, useContext } from 'react';
// Custom
import StoreContext from '../../store/Store/StoreContext';
import BountyList from './BountyList';
import GithubDown from '../Utils/GithubDown';

const BountyHomepage = () => {
	// State
	const [bounties, setBounties] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [githubOutage, setGithubOutage] = useState(false);

	// Context
	const [appState] = useContext(StoreContext);

	// Hooks
	useEffect(() => {
		populateBountyData();
	}, []);

	// Methods
	async function populateBountyData() {
		setIsLoading(true);

		const bounties = await appState.openQSubgraphClient.getAllBounties();

		const bountyIds = bounties.map((bounty) => bounty.bountyId);
		let issueData;
		try{
			issueData = await appState.githubRepository.getIssueData(bountyIds);
		}
		catch(error){
			setGithubOutage(true);
		}
		const fullBounties = [];
		bounties.forEach((bounty) => {
			const relatedIssue = issueData.find(
				(issue) => issue.id == bounty.bountyId
			);
			const mergedBounty = { ...bounty, ...relatedIssue };
			fullBounties.push(mergedBounty);
		});

		setBounties(fullBounties);
		setIsLoading(false);
	}

	// Render
	return (
		<div className="grid xl:grid-cols-wide justify-center">
			{githubOutage?				
				<GithubDown/>
				:
				<BountyList bounties={bounties} loading={isLoading}/>
			}
		</div>
	);
};

export default BountyHomepage;
