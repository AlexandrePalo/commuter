import React, { Component } from 'react'

class AdjacencyMatrix {
  /*
  Matrix storing weight information between edges. ONLY FOR STRICTLY SUPERIOR MATRICES.
  As the matrix is strictly superior, only n(n-1)/2 terms are stored in a 1D array (list).
  The function eq1D is used to get the equivalence between 1D and 2D.
  However, the user get and set terms using classic (i, j) decomposition.

  https://en.wikipedia.org/wiki/Adjacency_matrix
  */
  constructor(n, random = false) {
    this.n = n
    const len = (n * (n - 1)) / 2
    const buffer = new ArrayBuffer(len * 2)
    this.arr = new Int16Array(buffer)

    if (random) {
      for (let i = 0; i < this.arr.length; i++) {
        const r = Math.floor(Math.random() * 100)
        this.arr[i] = r <= 50 ? r : -1
      }
    }
  }
  eq1D(i, j) {
    if (i >= this.n || j >= this.n || i === j) {
      throw 'i and j must be lower than n'
    }
    if (j > i) {
      return i * this.n + j - ((i + 1) * (i + 2)) / 2
    } else {
      return j * this.n + i - ((j + 1) * (j + 2)) / 2
    }
  }
  get(i, j) {
    const k = this.eq1D(i, j)
    return this.arr[k]
  }
  set(i, j, w) {
    const k = this.eq1D(i, j)
    this.arr[k] = w
  }
  getAdjacentEdges(i) {
    const adjacentEdges = []

    // Same line, strictly superior
    for (let j = i + 1; j < this.n; j++) {
      // Check if j is adjacent to i
      if (this.get(i, j) >= 0) {
        adjacentEdges.push(j)
      }
    }

    // Same column, strictly superior
    for (let k = 0; k < i; k++) {
      // Check if k is adjacent to i
      if (this.get(k, i) >= 0) {
        adjacentEdges.push(k)
      }
    }
    return adjacentEdges
  }
  getAdjacentOpenEdges(i, Q) {
    const adjacentEdges = []

    // Same line, strictly superior
    for (let j = i + 1; j < this.n; j++) {
      // Check if j is adjacent to i
      if (Q.has(j) && this.get(i, j) >= 0) {
        adjacentEdges.push(j)
      }
    }

    // Same column, strictly superior
    for (let k = 0; k < i; k++) {
      // Check if k is adjacent to i
      if (Q.has(k) && this.get(k, i) >= 0) {
        adjacentEdges.push(k)
      }
    }
    return adjacentEdges
  }
  setMatrix(matrix1D) {
    // Element by element copy
    // slice(0) is the faster for big arrays https://jsperf.com/cloning-arrays/3
    if (matrix1D.length !== this.arr.length) {
      throw "Given matrix size doesn't match"
    }
    this.arr = matrix1D.slice(0)
  }
}

class DijkstaAlgorithm {
  constructor(AdjacencyMatrix, startEdge) {
    this.AM = AdjacencyMatrix
    this.start = startEdge

    this.n = this.AM.n
    this.keys = Array.from(Array(this.AM.n).keys()) // [0, 1, 2, ... n-1]
    this.Q = new Set()
    this.dist = new Array(this.AM.n)
    this.prev = new Array(this.AM.n)

    /*
    get distance of edge i / start : dist[i]
    get previous of edge i / start : prev[i]
    */
  }

  init() {
    for (let v in this.keys) {
      this.dist[v] = undefined
      this.prev[v] = undefined
      this.Q.add(Number(v))
    }
  }

  calc() {
    // Start
    this.dist[this.start] = 0
    this.prev[this.start] = this.start

    // ITERATION
    let preventer = 0
    while (this.Q.size > 0 && preventer < this.n * 2) {
      console.log(this.Q, this.dist, this.prev)
      // Select smaller open edge
      const selected = this.dist.reduce((selected, d, e) => {
        if (d >= 0 && this.Q.has(e)) {
          if (this.dist[selected] === undefined || d < this.dist[selected]) {
            return e
          }
          return selected
        }
        return selected
      }, false)
      const selectedDist = this.dist[selected]
      if (selected === undefined) {
        //console.log('break, no selected', selected)
        break
      }
      const selectedAdjacentOpenEdges = this.AM.getAdjacentOpenEdges(
        selected,
        this.Q
      )
      if (selectedAdjacentOpenEdges.length === 0) {
        //console.log('break, no adjacent edges', selectedAdjacentOpenEdges)
        break
      }

      // Close selected edge
      this.Q.delete(selected)
      console.log(selected, selectedAdjacentOpenEdges)

      // Calculate dist for adjacent edges to selected edge
      selectedAdjacentOpenEdges.forEach(e => {
        const w = this.AM.get(selected, e)
        // Update if smaller or still not defined
        if (this.dist[e] === undefined || w + selectedDist < this.dist[e]) {
          this.dist[e] = w + selectedDist
          this.prev[e] = selected
        }
      })

      preventer = preventer + 1
    }
  }
}

const nbStops = 6
const A = new AdjacencyMatrix(nbStops)
// E L M N S T
const initMatrix1D = [8, 10, -1, 10, 4, 7, 2, 5, -1, 4, -1, -1, 8, -1, 8]
A.setMatrix(initMatrix1D)
console.log(A.arr)
const B = new DijkstaAlgorithm(A, 2)
B.init()
B.calc()
console.log(B.dist, B.prev)

export default class extends Component {
  render() {
    return (
      <div>
        <h1>Hello world</h1>
      </div>
    )
  }
}
