export function failureFunction(P: String, m = P.length): number[] {
  // No proper prefix for string of length 1:
  const arr = [0]
  let i = 0,
    j = 1

  while (j < m) {
    if (P[i] == P[j]) {
      i++
      arr.push(i)
      j++
    }
    // The first character didn't match:
    else if (i == 0) {
      arr.push(0)
      j++
    }
    // Mismatch after at least one matching character:
    else {
      i = arr[i - 1]
    }
  }
  return arr
}
