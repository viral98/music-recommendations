
/**
 * TODO: Remove this function and use the one in the recommendation service
 * @returns Mock data for testing the accuracy of the recommendation engine
 */
export function getRandomListOfRecommendations(): number[][]{
  const listOfRecommendationsWithAttributes = (
    Array.from(
      { length: 10 },
      () => Array.from(
        { length: 20 },
        () => parseFloat((Math.random()).toFixed(4))
      )
    )
  );

  return listOfRecommendationsWithAttributes;
}