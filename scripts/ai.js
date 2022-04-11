document.querySelector('.edge');
function pickMove(){
    const bestMove = miniMax(node, depth, seen, 'Blue');

}
function miniMax(node, depth, seen, player){
    let childValMax = 0;
    if(currPlayer == maximizingPlayer)
        childValMax = (-Number.MAX_VALUE) * 2;
    else
        childValMax = Number.MAX_VALUE;
    for(let i = 0; i < rowSize; ++i){
        for(let j = 0; j < colSize; ++j){
            const found = edges.find((edge) => edge.hasAttribute('id') && (edge.id === `h-${i}-${j}` || edge.id === `v-${i}-${j}`) );
            if(found !== undefined){
                seen.add(found.id);
                childValMax = Math.max(childValMax, miniMax(found, depth, seen, player ^ 1));
                seen.remove(found.id);
            }
        }
    }
}
