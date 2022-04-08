// eslint-disable-next-line @typescript-eslint/no-var-requires
const similarity = require( 'compute-cosine-similarity' );

/**
 * Testing function to determine the accuracy of the recommendation engine.
 * @param listOfRecommendationsWithAttributes This a 2-D array containing the attributes of the songs recommended by CF
 * @returns The cosine similarity of the songs recommended by CF
 */
export function getCosineSimilarities(listOfRecommendationsWithAttributes: number[][]):number{
  let cosineSimilaritiesOfAllReccomendations = 0;
  for (let i = 0; i < 10; i++) {
    for (let j = i + 1; j < 10; j++) {
      if (j == 10) continue;
      cosineSimilaritiesOfAllReccomendations += similarity(
        listOfRecommendationsWithAttributes[i],
        listOfRecommendationsWithAttributes[j]
      );
    }
  }
  const averageCosineSimilarity = cosineSimilaritiesOfAllReccomendations / 45;

  return averageCosineSimilarity;
}