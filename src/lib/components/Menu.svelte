<script>
	let expanded = false;

	import { visModeOptions, visMode } from "../../stores/filterData";

	const setMode = function (d) {
		visMode.set(d.value);
	};
	const toggleExpanded = (_) => (expanded = !expanded);

	setTimeout(()=>{expanded=true},1000)
</script>

<nav class:expanded>
	<button on:click={toggleExpanded}>
		{@html expanded ? '&#9204;': "&#8801"}
		<span style="padding: none;font-size: 16px;font-weight:100">{expanded ? "" : "DATA"}</span>
	</button>

	<section class="non-essential">
		<ul>
			<h3>Data source</h3>
			<hr />

			{#each $visModeOptions as d, i}
				<li
					on:click={setMode(d)}
					style="color:{$visMode == d.value ? 'white' : '#A2B7C4'}"
				>
					<span>{d.label}</span>
				</li>
			{/each}
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

	ul {
		list-style: none;
		padding: 20px;
		margin: 0;
	}

	li {
		width: 200px;
		cursor: pointer;
		padding: 5px;
	}

	li :hover {
		color: white;
	}

	h3 {
		text-transform: uppercase;
		padding: 5px;
		font-size: 1.4rem;
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
