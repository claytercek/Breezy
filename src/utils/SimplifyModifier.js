/* eslint-disable */
/**
 *	@author zz85 / http://twitter.com/blurspline / http://www.lab4games.net/zz85/blog
 *
 *	Simplification Geometry Modifier
 *    - based on code and technique
 *	  - by Stan Melax in 1998
 *	  - Progressive Mesh type Polygon Reduction Algorithm
 *    - http://www.melax.com/polychop/
 */

import {
  BufferGeometry,
  Float32BufferAttribute,
  Geometry,
  Vector3,
} from 'three';

const SimplifyModifier = function() {};

( function() {
  const cb = new Vector3(); const ab = new Vector3();

  function pushIfUnique( array, object ) {
    if ( array.indexOf( object ) === - 1 ) array.push( object );
  }

  function removeFromArray( array, object ) {
    const k = array.indexOf( object );
    if ( k > - 1 ) array.splice( k, 1 );
  }

  function computeEdgeCollapseCost( u, v ) {
    // if we collapse edge uv by moving u to v then how
    // much different will the model change, i.e. the "error".

    const edgelength = v.position.distanceTo( u.position );
    let curvature = 0;

    const sideFaces = [];
    let i; const il = u.faces.length; let face; let sideFace;

    // find the "sides" triangles that are on the edge uv
    for ( i = 0; i < il; i ++ ) {
      face = u.faces[i];

      if ( face.hasVertex( v ) ) {
        sideFaces.push( face );
      }
    }

    // use the triangle facing most away from the sides
    // to determine our curvature term
    for ( i = 0; i < il; i ++ ) {
      let minCurvature = 1;
      face = u.faces[i];

      for ( let j = 0; j < sideFaces.length; j ++ ) {
        sideFace = sideFaces[j];
        // use dot product of face normals.
        const dotProd = face.normal.dot( sideFace.normal );
        minCurvature = Math.min( minCurvature, ( 1.001 - dotProd ) / 2 );
      }

      curvature = Math.max( curvature, minCurvature );
    }

    // crude approach in attempt to preserve borders
    // though it seems not to be totally correct
    const borders = 0;
    if ( sideFaces.length < 2 ) {
      // we add some arbitrary cost for borders,
      // borders += 10;
      curvature = 1;
    }

    const amt = edgelength * curvature + borders;

    return amt;
  }

  function computeEdgeCostAtVertex( v ) {
    // compute the edge collapse cost for all edges that start
    // from vertex v.  Since we are only interested in reducing
    // the object by selecting the min cost edge at each step, we
    // only cache the cost of the least cost edge at this vertex
    // (in member variable collapse) as well as the value of the
    // cost (in member variable collapseCost).

    if ( v.neighbors.length === 0 ) {
      // collapse if no neighbors.
      v.collapseNeighbor = null;
      v.collapseCost = - 0.01;

      return;
    }

    v.collapseCost = 100000;
    v.collapseNeighbor = null;

    // search all neighboring edges for "least cost" edge
    for ( let i = 0; i < v.neighbors.length; i ++ ) {
      const collapseCost = computeEdgeCollapseCost( v, v.neighbors[i] );

      if ( ! v.collapseNeighbor ) {
        v.collapseNeighbor = v.neighbors[i];
        v.collapseCost = collapseCost;
        v.minCost = collapseCost;
        v.totalCost = 0;
        v.costCount = 0;
      }

      v.costCount ++;
      v.totalCost += collapseCost;

      if ( collapseCost < v.minCost ) {
        v.collapseNeighbor = v.neighbors[i];
        v.minCost = collapseCost;
      }
    }

    // we average the cost of collapsing at this vertex
    v.collapseCost = v.totalCost / v.costCount;
    // v.collapseCost = v.minCost;
  }

  function removeVertex( v, vertices ) {
    console.assert( v.faces.length === 0 );

    while ( v.neighbors.length ) {
      const n = v.neighbors.pop();
      removeFromArray( n.neighbors, v );
    }

    removeFromArray( vertices, v );
  }

  function removeFace( f, faces ) {
    removeFromArray( faces, f );

    if ( f.v1 ) removeFromArray( f.v1.faces, f );
    if ( f.v2 ) removeFromArray( f.v2.faces, f );
    if ( f.v3 ) removeFromArray( f.v3.faces, f );

    // TODO optimize this!
    const vs = [f.v1, f.v2, f.v3];
    let v1; let v2;

    for ( let i = 0; i < 3; i ++ ) {
      v1 = vs[i];
      v2 = vs[( i + 1 ) % 3];

      if ( ! v1 || ! v2 ) continue;

      v1.removeIfNonNeighbor( v2 );
      v2.removeIfNonNeighbor( v1 );
    }
  }

  function collapse( vertices, faces, u, v ) { // u and v are pointers to vertices of an edge
    // Collapse the edge uv by moving vertex u onto v

    if ( ! v ) {
      // u is a vertex all by itself so just delete it..
      removeVertex( u, vertices );
      return;
    }

    let i;
    const tmpVertices = [];

    for ( i = 0; i < u.neighbors.length; i ++ ) {
      tmpVertices.push( u.neighbors[i] );
    }


    // delete triangles on edge uv:
    for ( i = u.faces.length - 1; i >= 0; i -- ) {
      if ( u.faces[i].hasVertex( v ) ) {
        removeFace( u.faces[i], faces );
      }
    }

    // update remaining triangles to have v instead of u
    for ( i = u.faces.length - 1; i >= 0; i -- ) {
      u.faces[i].replaceVertex( u, v );
    }


    removeVertex( u, vertices );

    // recompute the edge collapse costs in neighborhood
    for ( i = 0; i < tmpVertices.length; i ++ ) {
      computeEdgeCostAtVertex( tmpVertices[i] );
    }
  }


  function minimumCostEdge( vertices ) {
    // O(n * n) approach. TODO optimize this

    let least = vertices[0];

    for ( let i = 0; i < vertices.length; i ++ ) {
      if ( vertices[i].collapseCost < least.collapseCost ) {
        least = vertices[i];
      }
    }

    return least;
  }

  // we use a triangle class to represent structure of face slightly differently

  function Triangle( v1, v2, v3, a, b, c ) {
    this.a = a;
    this.b = b;
    this.c = c;

    this.v1 = v1;
    this.v2 = v2;
    this.v3 = v3;

    this.normal = new Vector3();

    this.computeNormal();

    v1.faces.push( this );
    v1.addUniqueNeighbor( v2 );
    v1.addUniqueNeighbor( v3 );

    v2.faces.push( this );
    v2.addUniqueNeighbor( v1 );
    v2.addUniqueNeighbor( v3 );


    v3.faces.push( this );
    v3.addUniqueNeighbor( v1 );
    v3.addUniqueNeighbor( v2 );
  }

  Triangle.prototype.computeNormal = function() {
    const vA = this.v1.position;
    const vB = this.v2.position;
    const vC = this.v3.position;

    cb.subVectors( vC, vB );
    ab.subVectors( vA, vB );
    cb.cross( ab ).normalize();

    this.normal.copy( cb );
  };

  Triangle.prototype.hasVertex = function( v ) {
    return v === this.v1 || v === this.v2 || v === this.v3;
  };

  Triangle.prototype.replaceVertex = function( oldv, newv ) {
    if ( oldv === this.v1 ) this.v1 = newv;
    else if ( oldv === this.v2 ) this.v2 = newv;
    else if ( oldv === this.v3 ) this.v3 = newv;

    removeFromArray( oldv.faces, this );
    newv.faces.push( this );


    oldv.removeIfNonNeighbor( this.v1 );
    this.v1.removeIfNonNeighbor( oldv );

    oldv.removeIfNonNeighbor( this.v2 );
    this.v2.removeIfNonNeighbor( oldv );

    oldv.removeIfNonNeighbor( this.v3 );
    this.v3.removeIfNonNeighbor( oldv );

    this.v1.addUniqueNeighbor( this.v2 );
    this.v1.addUniqueNeighbor( this.v3 );

    this.v2.addUniqueNeighbor( this.v1 );
    this.v2.addUniqueNeighbor( this.v3 );

    this.v3.addUniqueNeighbor( this.v1 );
    this.v3.addUniqueNeighbor( this.v2 );

    this.computeNormal();
  };

  function Vertex( v, id ) {
    this.position = v;

    this.id = id; // old index id

    this.faces = []; // faces vertex is connected
    this.neighbors = []; // neighbouring vertices aka "adjacentVertices"

    // these will be computed in computeEdgeCostAtVertex()
    this.collapseCost = 0; // cost of collapsing this vertex, the less the better. aka objdist
    this.collapseNeighbor = null; // best candinate for collapsing
  }

  Vertex.prototype.addUniqueNeighbor = function( vertex ) {
    pushIfUnique( this.neighbors, vertex );
  };

  Vertex.prototype.removeIfNonNeighbor = function( n ) {
    const neighbors = this.neighbors;
    const faces = this.faces;

    const offset = neighbors.indexOf( n );
    if ( offset === - 1 ) return;
    for ( let i = 0; i < faces.length; i ++ ) {
      if ( faces[i].hasVertex( n ) ) return;
    }

    neighbors.splice( offset, 1 );
  };

  SimplifyModifier.prototype.modify = function( geometry, count ) {
    if ( geometry.isBufferGeometry ) {
      geometry = new Geometry().fromBufferGeometry( geometry );
    }

    geometry.mergeVertices();

    const oldVertices = geometry.vertices; // Three Position
    const oldFaces = geometry.faces; // Three Face

    // conversion
    const vertices = [];
    const faces = [];

    let i; let il;

    //
    // put data of original geometry in different data structures
    //

    // add vertices

    for ( i = 0, il = oldVertices.length; i < il; i ++ ) {
      var vertex = new Vertex( oldVertices[i], i );
      vertices.push( vertex );
    }

    // add faces

    for ( i = 0, il = oldFaces.length; i < il; i ++ ) {
      var face = oldFaces[i];

      var a = face.a;
      var b = face.b;
      var c = face.c;

      const triangle = new Triangle( vertices[a], vertices[b], vertices[c], a, b, c );
      faces.push( triangle );
    }

    // compute all edge collapse costs

    for ( i = 0, il = vertices.length; i < il; i ++ ) {
      computeEdgeCostAtVertex( vertices[i] );
    }

    let nextVertex;

    let z = count;

    while ( z -- ) {
      nextVertex = minimumCostEdge( vertices );

      if ( ! nextVertex ) {
        console.log( 'THREE.SimplifyModifier: No next vertex' );
        break;
      }

      collapse( vertices, faces, nextVertex, nextVertex.collapseNeighbor );
    }

    //

    const simplifiedGeometry = new BufferGeometry();
    const position = [];
    const index = [];

    //

    for ( i = 0; i < vertices.length; i ++ ) {
      var vertex = vertices[i].position;
      position.push( vertex.x, vertex.y, vertex.z );
    }

    //

    for ( i = 0; i < faces.length; i ++ ) {
      var face = faces[i];

      var a = vertices.indexOf( face.v1 );
      var b = vertices.indexOf( face.v2 );
      var c = vertices.indexOf( face.v3 );

      index.push( a, b, c );
    }

    //

    simplifiedGeometry.setAttribute( 'position', new Float32BufferAttribute( position, 3 ) );
    simplifiedGeometry.setIndex( index );

    return simplifiedGeometry;
  };
} )();

export {SimplifyModifier};
