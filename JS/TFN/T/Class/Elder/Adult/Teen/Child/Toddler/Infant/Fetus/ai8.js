//clustered learning

function kMeans(data, k = 2, iterations = 10) {
  let centroids = data.slice(0, k);

  for (let iter = 0; iter < iterations; iter++) {
    let clusters = Array.from({ length: k }, () => []);

    for (let point of data) {
      let distances = centroids.map(c =>
        Math.hypot(...c.map((v, i) => v - point[i]))
      );

      let idx = distances.indexOf(Math.min(...distances));
      clusters[idx].push(point);
    }

    centroids = clusters.map(cluster =>
      cluster[0].map((_, i) =>
        cluster.reduce((sum, p) => sum + p[i], 0) / cluster.length
      )
    );
  }

  return centroids;
}