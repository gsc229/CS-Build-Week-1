// generate rooms and use/import graph for map
// Render Graph component from react-d3-graph
// state = rooms, game data/info

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Graph } from "react-d3-graph";

const myConfig = {
    automaticRearrangeAfterDropNode: true,
    collapsible: false,
    directed: false,
    focusAnimationDuration: 0.75,
    focusZoom: 1,
    highlightDegree: 0, // set to 1 if we want light highlights added
    highlightOpacity: 0,
    linkHighlightBehavior: false, //set true if we want to see line highlights
    maxZoom: 5, // ? test
    minZoom: 0.1, // ? test
    nodeHighlightBehavior: false,
    panAndZoom: false,
    staticGraph: true,
    staticGraphWithDragAndDrop: true,
    d3: {
        alphaTarget: 0,
        gravity: -400,
        linkLength: 180, // ? test
        linkStrength: 1
      },
    node: {
        color: "#d3d3d3",
        fontColor: "black",
        fontSize: 12,
        fontWeight: "normal",
        highlightColor: "SAME",
        highlightFontSize: 12,
        highlightFontWeight: "bold",
        highlightStrokeColor: "SAME",
        highlightStrokeWidth: "SAME",
        mouseCursor: "pointer",
        opacity: 1,
        renderLabel: false,
        size: 50, // play with sizes
        strokeColor: "none",
        strokeWidth: 2,
        svg: "",
        symbolType: "square" // play with shape of nodes
      }, 
    link: {
        color: "#d3d3d3",
        fontColor: "red",
        fontSize: 10,
        fontWeight: "normal",
        highlightColor: "blue",
        highlightFontSize: 8,
        highlightFontWeight: "bold",
        labelProperty: "label",
        mouseCursor: "pointer",
        opacity: 1,
        renderLabel: false,
        semanticStrokeWidth: true,
        strokeWidth: 1.5
      }
}
const testNodes = [
    {
        id: 0,
        x: 3,
        y: -3,
        north: 27,
        south: 42,
        east: 30,
        west: 0
      },
      {
        id: 29,
        x: 3,
        y: -3,
        north: 27,
        south: 42,
        east: 30,
        west: 0
      },
      {
        id: 26,
        x: 2,
        y: -2,
        north: 13,
        south: 0,
        east: 27,
        west: 0
      },
      {
        id: 1,
        x: 0,
        y: 0,
        north: 0,
        south: 3,
        east: 4,
        west: 2
      },
      {
        id: 2,
        x: -1,
        y: 0,
        north: 6,
        south: 47,
        east: 1,
        west: 0
      },
      {
        id: 3,
        x: 0,
        y: -1,
        north: 1,
        south: 11,
        east: 9,
        west: 0
      },
      {
        id: 4,
        x: 1,
        y: 0,
        north: 5,
        south: 9,
        east: 39,
        west: 1
      },
      {
        id: 5,
        x: 1,
        y: 1,
        north: 15,
        south: 4,
        east: 7,
        west: 0
      },
      {
        id: 6,
        x: -1,
        y: 1,
        north: 14,
        south: 2,
        east: 0,
        west: 23
      },
      {
        id: 7,
        x: 2,
        y: 1,
        north: 0,
        south: 0,
        east: 8,
        west: 5
      },
      {
        id: 8,
        x: 3,
        y: 1,
        north: 10,
        south: 19,
        east: 31,
        west: 7
      },
      {
        id: 9,
        x: 1,
        y: -1,
        north: 4,
        south: 0,
        east: 13,
        west: 3
      },
      {
        id: 10,
        x: 3,
        y: 2,
        north: 0,
        south: 8,
        east: 0,
        west: 0
      },
      {
        id: 11,
        x: 0,
        y: -2,
        north: 3,
        south: 0,
        east: 0,
        west: 12
      },
      {
        id: 12,
        x: -1,
        y: -2,
        north: 47,
        south: 18,
        east: 11,
        west: 28
      },
      {
        id: 13,
        x: 2,
        y: -1,
        north: 39,
        south: 26,
        east: 0,
        west: 9
      },
      {
        id: 14,
        x: -1,
        y: 2,
        north: 0,
        south: 6,
        east: 0,
        west: 24
      },
      {
        id: 15,
        x: 1,
        y: 2,
        north: 21,
        south: 5,
        east: 0,
        west: 0
      },
      {
        id: 16,
        x: 4,
        y: 2,
        north: 33,
        south: 31,
        east: 17,
        west: 0
      },
      {
        id: 17,
        x: 5,
        y: 2,
        north: 20,
        south: 0,
        east: 52,
        west: 16
      },
      {
        id: 18,
        x: -1,
        y: -3,
        north: 12,
        south: 0,
        east: 22,
        west: 41
      },
      {
        id: 19,
        x: 3,
        y: 0,
        north: 8,
        south: 0,
        east: 25,
        west: 0
      },
      {
        id: 20,
        x: 5,
        y: 3,
        north: 50,
        south: 17,
        east: 77,
        west: 0
      },
      {
        id: 21,
        x: 1,
        y: 3,
        north: 35,
        south: 15,
        east: 44,
        west: 37
      },
      {
        id: 22,
        x: 0,
        y: -3,
        north: 0,
        south: 45,
        east: 66,
        west: 18
      },
      {
        id: 23,
        x: -2,
        y: 1,
        north: 24,
        south: 0,
        east: 6,
        west: 93
      },
      {
        id: 24,
        x: -2,
        y: 2,
        north: 0,
        south: 23,
        east: 14,
        west: 34
      },
      {
        id: 25,
        x: 4,
        y: 0,
        north: 31,
        south: 0,
        east: 48,
        west: 19
      },
      {
        id: 27,
        x: 3,
        y: -2,
        north: 0,
        south: 29,
        east: 0,
        west: 26
      },
      {
        id: 28,
        x: -2,
        y: -2,
        north: 0,
        south: 0,
        east: 12,
        west: 32
      },
      {
        id: 30,
        x: 4,
        y: -3,
        north: 0,
        south: 49,
        east: 43,
        west: 29
      },
      {
        id: 31,
        x: 4,
        y: 1,
        north: 16,
        south: 25,
        east: 0,
        west: 8
      },
      {
        id: 32,
        x: -3,
        y: -2,
        north: 36,
        south: 40,
        east: 28,
        west: 0
      },
      {
        id: 33,
        x: 4,
        y: 3,
        north: 0,
        south: 16,
        east: 0,
        west: 0
      },
      {
        id: 34,
        x: -3,
        y: 2,
        north: 0,
        south: 0,
        east: 24,
        west: 0
      },
      {
        id: 35,
        x: 1,
        y: 4,
        north: 53,
        south: 21,
        east: 0,
        west: 61
      },
      {
        id: 36,
        x: -3,
        y: -1,
        north: 0,
        south: 32,
        east: 0,
        west: 89
      },
      {
        id: 37,
        x: 0,
        y: 3,
        north: 61,
        south: 0,
        east: 21,
        west: 58
      },
      {
        id: 38,
        x: -4,
        y: -2,
        north: 89,
        south: 55,
        east: 0,
        west: 74
      },
      {
        id: 39,
        x: 2,
        y: 0,
        north: 0,
        south: 13,
        east: 0,
        west: 4
      },
      {
        id: 40,
        x: -3,
        y: -3,
        north: 32,
        south: 91,
        east: 41,
        west: 55
      },
      {
        id: 41,
        x: -2,
        y: -3,
        north: 0,
        south: 0,
        east: 18,
        west: 40
      },
      {
        id: 42,
        x: 3,
        y: -4,
        north: 29,
        south: 51,
        east: 0,
        west: 0
      },
      {
        id: 43,
        x: 5,
        y: -3,
        north: 65,
        south: 0,
        east: 0,
        west: 30
      },
      {
        id: 44,
        x: 2,
        y: 3,
        north: 0,
        south: 0,
        east: 0,
        west: 21
      },
      {
        id: 45,
        x: 0,
        y: -4,
        north: 22,
        south: 57,
        east: 69,
        west: 59
      },
      {
        id: 46,
        x: -3,
        y: 3,
        north: 78,
        south: 0,
        east: 94,
        west: 88
      },
      {
        id: 47,
        x: -1,
        y: -1,
        north: 2,
        south: 12,
        east: 0,
        west: 0
      },
      {
        id: 48,
        x: 5,
        y: 0,
        north: 0,
        south: 0,
        east: 0,
        west: 25
      },
      {
        id: 49,
        x: 4,
        y: -4,
        north: 30,
        south: 0,
        east: 0,
        west: 0
      },
      {
        id: 50,
        x: 5,
        y: 4,
        north: 0,
        south: 20,
        east: 0,
        west: 0
      },
      {
        id: 51,
        x: 3,
        y: -5,
        north: 42,
        south: 54,
        east: 73,
        west: 64
      },
      {
        id: 52,
        x: 6,
        y: 2,
        north: 0,
        south: 83,
        east: 0,
        west: 17
      },
      {
        id: 53,
        x: 1,
        y: 5,
        north: 79,
        south: 35,
        east: 60,
        west: 0
      },
      {
        id: 54,
        x: 3,
        y: -6,
        north: 51,
        south: 0,
        east: 0,
        west: 0
      },
      {
        id: 55,
        x: -4,
        y: -3,
        north: 38,
        south: 0,
        east: 40,
        west: 0
      },
      {
        id: 56,
        x: -5,
        y: -3,
        north: 0,
        south: 71,
        east: 0,
        west: 76
      },
      {
        id: 57,
        x: 0,
        y: -5,
        north: 45,
        south: 0,
        east: 63,
        west: 85
      },
      {
        id: 58,
        x: -1,
        y: 3,
        north: 80,
        south: 0,
        east: 37,
        west: 94
      },
      {
        id: 59,
        x: -1,
        y: -4,
        north: 0,
        south: 0,
        east: 45,
        west: 0
      },
      {
        id: 60,
        x: 2,
        y: 5,
        north: 0,
        south: 62,
        east: 72,
        west: 53
      },
      {
        id: 61,
        x: 0,
        y: 4,
        north: 0,
        south: 37,
        east: 35,
        west: 80
      },
      {
        id: 62,
        x: 2,
        y: 4,
        north: 60,
        south: 0,
        east: 68,
        west: 0
      },
      {
        id: 63,
        x: 1,
        y: -5,
        north: 69,
        south: 0,
        east: 64,
        west: 57
      },
      {
        id: 64,
        x: 2,
        y: -5,
        north: 0,
        south: 0,
        east: 51,
        west: 63
      },
      {
        id: 65,
        x: 5,
        y: -2,
        north: 70,
        south: 43,
        east: 75,
        west: 0
      },
      {
        id: 66,
        x: 1,
        y: -3,
        north: 0,
        south: 0,
        east: 0,
        west: 22
      },
      {
        id: 67,
        x: -4,
        y: -4,
        north: 0,
        south: 90,
        east: 0,
        west: 71
      },
      {
        id: 68,
        x: 3,
        y: 4,
        north: 72,
        south: 0,
        east: 0,
        west: 62
      },
      {
        id: 69,
        x: 1,
        y: -4,
        north: 0,
        south: 63,
        east: 0,
        west: 45
      },
      {
        id: 70,
        x: 5,
        y: -1,
        north: 0,
        south: 65,
        east: 0,
        west: 0
      },
      {
        id: 71,
        x: -5,
        y: -4,
        north: 56,
        south: 0,
        east: 67,
        west: 0
      },
      {
        id: 72,
        x: 3,
        y: 5,
        north: 0,
        south: 68,
        east: 87,
        west: 60
      },
      {
        id: 73,
        x: 4,
        y: -5,
        north: 0,
        south: 0,
        east: 0,
        west: 51
      },
      {
        id: 74,
        x: -5,
        y: -2,
        north: 86,
        south: 0,
        east: 38,
        west: 0
      },
      {
        id: 75,
        x: 6,
        y: -2,
        north: 0,
        south: 0,
        east: 0,
        west: 65
      },
      {
        id: 76,
        x: -6,
        y: -3,
        north: 82,
        south: 0,
        east: 56,
        west: 0
      },
      {
        id: 77,
        x: 6,
        y: 3,
        north: 0,
        south: 0,
        east: 0,
        west: 20
      },
      {
        id: 78,
        x: -3,
        y: 4,
        north: 101,
        south: 46,
        east: 0,
        west: 0
      },
      {
        id: 79,
        x: 1,
        y: 6,
        north: 98,
        south: 53,
        east: 81,
        west: 0
      },
      {
        id: 80,
        x: -1,
        y: 4,
        north: 99,
        south: 58,
        east: 61,
        west: 0
      },
      {
        id: 81,
        x: 2,
        y: 6,
        north: 0,
        south: 0,
        east: 84,
        west: 79
      },
      {
        id: 82,
        x: -6,
        y: -2,
        north: 0,
        south: 76,
        east: 0,
        west: 0
      },
      {
        id: 83,
        x: 6,
        y: 1,
        north: 52,
        south: 0,
        east: 0,
        west: 0
      },
      {
        id: 84,
        x: 3,
        y: 6,
        north: 0,
        south: 0,
        east: 0,
        west: 81
      },
      {
        id: 85,
        x: -1,
        y: -5,
        north: 0,
        south: 0,
        east: 57,
        west: 0
      },
      {
        id: 86,
        x: -5,
        y: -1,
        north: 100,
        south: 74,
        east: 89,
        west: 97
      },
      {
        id: 87,
        x: 4,
        y: 5,
        north: 0,
        south: 0,
        east: 0,
        west: 72
      },
      {
        id: 88,
        x: -4,
        y: 3,
        north: 0,
        south: 0,
        east: 46,
        west: 96
      },
      {
        id: 89,
        x: -4,
        y: -1,
        north: 0,
        south: 38,
        east: 36,
        west: 86
      },
      {
        id: 90,
        x: -4,
        y: -5,
        north: 67,
        south: 0,
        east: 95,
        west: 0
      },
      {
        id: 91,
        x: -3,
        y: -4,
        north: 40,
        south: 95,
        east: 0,
        west: 0
      },
      {
        id: 92,
        x: -2,
        y: 4,
        north: 0,
        south: 94,
        east: 0,
        west: 0
      },
      {
        id: 93,
        x: -3,
        y: 1,
        north: 0,
        south: 0,
        east: 23,
        west: 0
      },
      {
        id: 94,
        x: -2,
        y: 3,
        north: 92,
        south: 0,
        east: 58,
        west: 46
      },
      {
        id: 95,
        x: -3,
        y: -5,
        north: 91,
        south: 0,
        east: 0,
        west: 90
      },
      {
        id: 96,
        x: -5,
        y: 3,
        north: 0,
        south: 0,
        east: 88,
        west: 0
      },
      {
        id: 97,
        x: -6,
        y: -1,
        north: 0,
        south: 0,
        east: 86,
        west: 0
      },
      {
        id: 98,
        x: 1,
        y: 7,
        north: 0,
        south: 79,
        east: 0,
        west: 0
      },
      {
        id: 99,
        x: -1,
        y: 5,
        north: 0,
        south: 80,
        east: 0,
        west: 0
      },
      {
        id: 100,
        x: -5,
        y: 0,
        north: 0,
        south: 86,
        east: 0,
        west: 0
      },
      {
        id: 101,
        x: -3,
        y: 5,
        north: 0,
        south: 78,
        east: 0,
        west: 0
      }
]

const Map = (props) => {
    console.log('props in Map', props)

    const [ graph, setGraph ] = useState({});
    const [ curNode, setCurNode ] = useState({});
    const [rectCoords, setRectCoords] = useState({
        height: 0,
        width: 0
      });
    const mapRef = useRef(null);

    const handleReload = useCallback(() => {
        //setCurNode to find room and room id via worldData room data
        //const visited = []
        // const nodes = filter rooms if visited -- include it in map
        // const adjacent - new Set() ????
        // for each node -- set new Set directions (greyed links)

        // const coords = mapRef.current -- RESEARCH VIEWPORT

        // const adjacentNodes - filter rooms for adjacent rooms
        // const newGraph

    })

    // a node has an ID, an east, south, x, y, 

    useEffect(() => {

        const coords = mapRef.current.getBoundingClientRect();
        coords.height *= 0.81;
        setRectCoords({
          height: coords.height,
          width: coords.width
        });

        const s_links = testNodes.filter(node => {
            if(node.south) {
                return true
            } else {
                return false
            }
        }).map(link => ({
            source: link.id,
            target: link.south
        }))

        const e_links = testNodes.filter(node => {
            if(node.east) {
                return true
            } else {
                return false
            }
        }).map(link => ({
            source: link.id,
            target: link.east
        }))

        const testGraph = {
            nodes: [
              ...testNodes.map(node => {
                return {
                  ...node,
                  x: node.x * (coords.width / 20) + 0.5 * coords.width,
                  y: node.y * -(coords.width / 20) + 0.5 * coords.height,
                  size: coords.width ,
                  color: "#2E4053 ",
                  symbolType: "square",
                  id: node.id
              }})
            ],
            links: [...s_links, ...e_links]
          };

          setGraph(testGraph);
        // handleReload();
        // window.addEventListener("resize", handleRefresh);
        // return () => window.removeEventListener("resize", handleRefresh);
    }, [])

    return(
        <div className='map-container' ref={mapRef}>
            {graph.nodes && rectCoords.height !== 0 ? (
                <div className='graph-container'>
                <Graph
                    className="graph"
                    id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
                    data={graph}
                    config={{
                        ...myConfig,
                        height: rectCoords.height,
                        width: rectCoords.width - 10
                      }}
                />

            <h2>
                {/* display the possible exits of this room in spans */}
            </h2>
            </div>
            ) : (
                <p>loading world map...</p>
            )}
            
        </div>
    )
}

export default Map;