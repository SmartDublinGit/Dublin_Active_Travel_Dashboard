<script>
  import { get } from "svelte/store";
  import { visMode, metricLabel, metricFormat,colorBreaks2,cols2 } from "../../stores/filterData";

  let range

    $:{ if(get(visMode) !='temp')
    {
        range = $colorBreaks2[$colorBreaks2.length-1] - $colorBreaks2[0]}
        else
        {
            range = 99
        }

        console.log('range')
        console.log(range)


      }

    function formatLabel(d) {
        let lab = $metricFormat.format(d)
        return lab
    }
    
    function getXpos(set,i) {
        if (i == 0) return 0;
        if (i == set.length - 1) return 100;
        return (set[i] - set[0])/(range)*100;
    }
    function getSquareWidth(set,i){
    
        return (set[i] - set[i - 1])/(range)*100;
    }
    
</script>


{#if range<99}
<div class="container open">
    <div class = "inside">
        <div class = "title" style="text-align: center;">{$metricLabel}</div>
        <div class = "legend-colors">
            {#each $cols2 as color,i}
            <div class="tick"/>
            <div class="square" style="background-color: {color}; width: {getSquareWidth($colorBreaks2,i)}%;" />
    {/each}
        </div>
        <div class = "legend-labels">
            {#each $colorBreaks2 as label, i}
            {#if i%2==0}
            
            <div class="label first" style:left="{getXpos($colorBreaks2,i)}%">{formatLabel(label)}</div>
            {/if}
            {/each}

        </div>
    </div>

</div> 

{/if}

<style>
    .container {
        transition: 100ms ease-in-out;
        width: fit-content;
        posiion: relative;
    
        border-radius: 20px;
    }
    .open {
        bottom: -30px;
        height: 0px;
        width: 100%;
        left:2%;
    }
    .inside{
        flex: 1 0 auto;
        padding: 7px 14px;
    }
    
    .legend-colors {
      display: flex;
      width: 100%;
    }

    .title{
        font-size: 1.1rem;
        margin-bottom: 6px;
    }

    .square {
      flex: 1 0 auto;
      height: 15px;
      border-color: #696969;
      border-width: .5px 0px .5px 0px;
      border-style: solid;
      opacity: .8;
    }
    .tick{
      width: 0px;
      height: 23px;
      border-left: 1px solid #696969;
    }

    .legend-labels{
      position: relative;
      height: 20px;
      width: 100%;
      font-size: 1rem;
    }

    .label {
      position: absolute;
      transform: translate(-50%, 0);
      line-height: 130%;
    }
    .label:first-child {
      transform: translate(0, 0);
    }
    .label:last-child {
text-align: right;    }

    .first{
      text-align: left;
    }


</style>