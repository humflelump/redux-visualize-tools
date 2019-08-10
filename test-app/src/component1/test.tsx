import React from 'react';
import * as d3 from 'd3';


function makeData(N: number): number[][] {
    const a = new Array(N);
    for (let i = 0; i < N; i++) {
        a[i] = [Math.random() * 400, Math.random() * 400];
    }
    return a;
}

interface State {
    data: number[][]
}

// export class D3Test extends React.Component<{}, State> {

//     constructor(props) {
//         super(props);
//         this.state = {
//             data: makeData(1000),
//         }
//         setInterval(() => {
//             this.setState({
//                 data: makeData(1000)
//             });
//         }, 1000);
//     }

//     componentDidUpdate() {
//         let t = performance.now();
//         const svg = d3.select('#yoyo');

//         const style = svg => svg            
//             .attr('x', d => d[0])
//             .attr('y', d => d[1])
//             .attr('width', 10)
//             .attr('height', 10)
//             .style('fill', 'blue')

//         const rects = svg.selectAll(".rect")
//             .data(this.state.data);

//         rects
//             .enter()
//             .append('rect')
//             .attr('class', 'rect')
//             .call(style)

//         rects.call(style)

//         rects.exit().remove()
//         console.log('took', performance.now() - t);
//     }

//     render() {
//         return <svg style={{width: 500, height: 500}} id="yoyo" />
//     }
// }


export class D3Test extends React.Component<{}, State> {

    constructor(props) {
        super(props);
        this.state = {
            data: makeData(1000),
        }
        setInterval(() => {
            this.setState({
                data: makeData(1000)
            });
        }, 1000);
    }

    componentDidUpdate() {
        let t = performance.now();
        var c = document.getElementById("yoyo");
        var ctx = (c as any).getContext("2d")  as CanvasRenderingContext2D;
        ctx.clearRect(0, 0, 500, 500);
        ctx.fillStyle = 'blue';
        for (let i = 0; i < this.state.data.length; i++) {
            const d = this.state.data[i];
            ctx.fillRect(d[0], d[1], 10, 10);
        }
        console.log('took', performance.now() - t);
    }

    render() {
        return <canvas style={{width: 500, height: 500}} id="yoyo" />
    }
}