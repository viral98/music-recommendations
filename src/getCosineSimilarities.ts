// eslint-disable-next-line @typescript-eslint/no-var-requires
const similarity = require( 'compute-cosine-similarity' );

/**
 * Testing function to determine the accuracy of the recommendation engine.
 * @param listOfRecommendationsWithAttributes This a 2-D array containing the attributes of the songs recommended by CF
 * @returns The cosine similarity of the songs recommended by CF
 */
export function getCosineSimilarities(listOfRecommendationsWithAttributes: number[][]):number{
  let cosineSimilaritiesOfAllReccomendations = 0;
  const size = listOfRecommendationsWithAttributes.length;
  for (let i = 0; i < size; i++) {
    for (let j = i + 1; j < size; j++) {
      if (j == size) continue;
      cosineSimilaritiesOfAllReccomendations += similarity(
        listOfRecommendationsWithAttributes[i],
        listOfRecommendationsWithAttributes[j]
      );
    }
  }
  const averageCosineSimilarity = cosineSimilaritiesOfAllReccomendations / getSummation(size);

  return averageCosineSimilarity;
}

/**
 * Testing function to determine the accuracy of the recommendation engine.
 * @param matrixA a 2-D array of the matrix for which cosine similarity is calcualted.
 * @param matrixB a 2-D array of the matrix with which cosine similarity is calcualted.
 * @returns The cosine similarity of the songs recommended by CF
 */
export function getInterCosineSimilarities(matrixA: number[][], matrixB: number[][]) {
  let cosineSimilaritiesOfAllReccomendations = 0;
  const size = matrixA.length
  for (let i = 0; i < size; i++) {
    for (let j = i + 1; j < size; j++) {
      if (j == size) continue;
      cosineSimilaritiesOfAllReccomendations += similarity(
        matrixA[i],
        matrixB[j]
      );
    }
  }
  const averageCosineSimilarity = cosineSimilaritiesOfAllReccomendations / size * size;

  return averageCosineSimilarity / 10;
}

function getSummation(number) {
  if (number === 0) {
    return 0;
  }
  return number + getSummation(number - 1)
}