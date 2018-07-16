
export class DrawingService {
  public _graph: any;

  constructor(graph) {
    this._graph = graph;
  }
  // Maps between resource type and asset image

  public drawLine(x1, y1, x2, y2, width= 1) {
    return this._graph.append('line')
      .attr('x1', x1)
      .attr('y1', y1)
      .attr('x2', x2)
      .attr('y2', y2)
      .attr('stroke', 'black')
      .attr('width', width);
  }
  // Draw text on graph
  public drawText(text, x, y, size) {
    return this._graph.append('text')
      .text(text)
      .attr('y', y)
      .attr('x', x)
      .attr('font-size', size);
  }
  public drawTextWithIcon(text,x,y,  size) {
    return this._graph.append('text')
    .attr('y', y)
      .attr('x', x)
       .attr('font-family', 'FontAwesome')
       .attr('font-size', size)
      .text(function(d) { return text }); 
  }

  public drawRectangle(width, height, fillColor, strokeColor, strokeWidth = 1) {
    return this._graph.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('stroke', strokeColor)
      .style('fill', fillColor)
      .attr('stroke-width', strokeWidth)
      .style('transition', 'opacity 0.5s');
  }
  // Draw circle on graph
  public drawCircle(radius, fillColor, strokeColor, strokeWidth) {
    return this._graph.append('circle')
      .attr('r', radius)
      .attr('stroke', strokeColor)
      .attr('stroke-width', strokeWidth)
      .style('fill', fillColor)
      .style('transition', 'opacity 0.5s');
  }

  public drawImage(node, image, x, y, width, height, opacity) {
    return node.append('image')
      .attr('xlink:href', image).attr('x', x).attr('y', y)
      .attr('width', width).attr('height', height).attr('opacity', opacity);
  }


  // Converts from planar to Radial coordinates.
  public convertToRadial(x, y) {
    const angle = (x - 90) / 180 * Math.PI, radius = y;
    return [radius * Math.cos(angle), radius * Math.sin(angle)];
  }

  // public getNodeLink(n1, n2) {
  //  return 'M' + n1[0] + ', ' + n1[1] + 'C' + n1[0] + ', ' + ((n1[1] + n2[1]) / 2) +
  // ' ' + n2[0] + ', ' + ((n1[1] + n2[1]) / 2) + ' ' + n2[0] + ' ,' + n2[1];
  // }
}
