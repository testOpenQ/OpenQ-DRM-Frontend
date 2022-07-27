import React from 'react';

const RepoTitle = ({bounty})=>{
	return (<div className="flex items-center justify-between pb-5 w-full px-2 sm:px-8">
		<div className='flex items-center gap-2'>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" className='fill-muted'>
				<path fillRule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z">
				</path>
			</svg>
			<div data-testid="title" className="text-xl text-link-colour">
				{	bounty.owner && `${bounty.owner} / ${bounty.repoName}`}
			</div>
		</div>
		<button className='flex items-center text-xs bg-inactive-gray leading-5 h-7 px-3 py-[3px] hover:bg-active-gray rounded-sm border hover:border-border-active border-border-gray'>
		
			<svg xmlns="http://www.w3.org/2000/svg" 
				className={'stroke-muted inline-block mr-2 fill-muted'} viewBox="0 0 16 16" width="16" height="16"><path d="M1.679 7.932c.412-.621 1.242-1.75 2.366-2.717C5.175 4.242 6.527 3.5 8 3.5c1.473 0 2.824.742 3.955 1.715 1.124.967 1.954 2.096 2.366 2.717a.119.119 0 010 .136c-.412.621-1.242 1.75-2.366 2.717C10.825 11.758 9.473 12.5 8 12.5c-1.473 0-2.824-.742-3.955-1.715C2.92 9.818 2.09 8.69 1.679 8.068a.119.119 0 010-.136zM8 2c-1.981 0-3.67.992-4.933 2.078C1.797 5.169.88 6.423.43 7.1a1.619 1.619 0 000 1.798c.45.678 1.367 1.932 2.637 3.024C4.329 13.008 6.019 14 8 14c1.981 0 3.67-.992 4.933-2.078 1.27-1.091 2.187-2.345 2.637-3.023a1.619 1.619 0 000-1.798c-.45-.678-1.367-1.932-2.637-3.023C11.671 2.992 9.981 2 8 2zm0 8a2 2 0 100-4 2 2 0 000 4z">
				</path>
			</svg>
			<span>Watch</span>
		</button>
	</div>);};
export default RepoTitle;