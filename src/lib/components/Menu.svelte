<script>
	let expanded = false;

	let expandedHierarchy1 = true;
	let expandedHierarchy2 = false;

	import { visModeOptions, visMode } from "../../stores/filterData";

	const setMode = function (d) {
		visMode.set(d.value);
	};
	const toggleExpanded = (_) => (expanded = !expanded);
	const toggleHierarchy1 = (_) => (expandedHierarchy1 = !expandedHierarchy1);
	const toggleHierarchy2 = (_) => (expandedHierarchy2 = !expandedHierarchy2
	)
	;

	setTimeout(()=>{expanded=true},1000)
</script>

<nav class:expanded>
	<button on:click={toggleExpanded}>
		{@html expanded ? '&#9204;': "&#8801"}
		<span style="padding: none;font-size: 16px;font-weight:100">{expanded ? "" : "DATA"}</span>
	</button>

	<section class="non-essential">
		<ul>
			<h3>Data Type</h3>
			<hr />

			<!-- Hierarchy 1 -->
		
				<button on:click={toggleHierarchy1}>
					<div class='hierarchy'>
					<span>{expandedHierarchy1 ? '▼' : ''} Boundary</span>
				</div>
				</button>
				{#if expandedHierarchy1}
					<ul>
						{#each $visModeOptions.slice(0, 2) as d, i}
							<li
								on:click={() => setMode(d)}
								style="color: {$visMode == d.value ? 'white' : '#A2B7C4'}"
							>
								<span>{d.label}</span>
							</li>
						{/each}
					</ul>
				{/if}
		

			<!-- Hierarchy 2 -->
		
				<div class='hierarchy'>
				
						{#each $visModeOptions.slice(2, 4) as d, i}
							<li
								on:click={() => setMode(d)}
								style="color: {$visMode == d.value ? 'white' : '#A2B7C4'}"
							>
								<span>{d.label}</span>
							</li>
						{/each}
			
				</div>
	



		</ul>
	</section>
</nav>

<style>
	nav {
		grid-area: nav;
		height: 100%;
		background-color: #324754;
		color: #a2b7c4;
		transition: ease-out 500ms;
		width: 60px;
		overflow: hidden;
	}

	.expanded {
		transition: ease-out 500ms;
		width: 200px;
	}

	.hierarchy{
		font-size: 1rem;
		padding-bottom: 0px;
		align-items: start;
		text-align: left;
		text-transform: none;
		font-family: var(--font-family-sans);
	}

	ul {
		list-style: none;
		padding-left: 20px;
		padding-right: 20px;
		margin: 0;
		padding-bottom: 0px;

	}

	li {
		width: 200px;
		cursor: pointer;
		padding: 0px;
		margin: 0px;
		padding-top: 15px;
		padding-left: 6px;

	}

	li :hover {
		color: white;
	}

	h3 {
		text-transform: uppercase;
	}

	hr {
		color: #a2b7c4;
		width: 80%;
	}

	button {
		border: none;
		background: none;
		color: #a2b7c4;
		font-size: 2rem;
		text-transform: uppercase;
		text-align: center;
		text-anchor: middle;
		width: 100%;
		cursor: pointer;
		padding: none;
		margin: none;
	}

	/** Here's all the fading in and out stuff **/

	.essential li > span,
	.non-essential {
		transition: opacity 200ms ease-out, visibility 0ms 200ms;
		opacity: 0;
		visibility: hidden;
	}

	.expanded .essential li > span,
	.expanded .non-essential {
		transition: opacity 200ms ease-out 100ms;
		opacity: 1;
		visibility: visible;
	}
</style>
