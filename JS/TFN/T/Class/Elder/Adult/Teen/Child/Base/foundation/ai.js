class Matrix {
  static dot(a, b) {
    return a.map((row, i) =>
      b[0].map((_, j) =>
        row.reduce((sum, val, k) => sum + val * b[k][j], 0)
      )
    );
  }

  static add(a, b) {
    return a.map((row, i) =>
      row.map((val, j) => val + b[i][j])
    );
  }

  static transpose(m) {
    return m[0].map((_, i) => m.map(row => row[i]));
  }
}