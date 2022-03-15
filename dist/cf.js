"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collaborativeFilter = void 0;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const math = require('mathjs');
/*
  * If you put this to 0, you will get recommendations from users which don't necessarily have
  * similar taste as you (these will however be lower ranked than recommendations from people
  * with similar taste). This option is available if you consider a cold start something that
  * will make your service seem poor. With this flag enabled, you will never receive a
  * recommendation from someone who has no similarity with you.
*/
const ONLY_RECOMMEND_FROM_SIMILAR_TASTE = 1;
const NORMALIZE_ON_POPULARITY = 1;
// Local functions
/**
 * Normalizes a co-occurrence matrix based on popularity.
 * TODO: Error check (size)
 * @param {mathjs matrix} coMatrix A co-occurrence matrix
 * @param {mathjs matrix} normalizerMatrix A matrix with division factors for the
 * coMatrix. Should be the same size as coMatrix
 * @returns {mathjs matrix} A normalized co-occurrence matrix
 */
function normalizeCoMatrix(coMatrix, normalizerMatrix) {
    return math.dotDivide(coMatrix, normalizerMatrix);
}
/**
 * Extract which items have a rating for a given user.
 * @param {array} ratings The ratings of all the users
 * @param {number} userIndex The index of the user you want to know which items
 * he or she has rated.
 * @param {number} numItems The number of items which have been rated.
 * @returns {array} An array of indices noting what games which have been rated.
 */
function getRatedItemsForUser(ratings, userIndex, numItems) {
    const ratedItems = [];
    for (let index = 0; index < numItems; index += 1) {
        if (ratings[userIndex][index] !== 0) {
            ratedItems.push(index);
        }
    }
    return ratedItems;
}
function typeCheckUserIndex(userIndex, ratings) {
    if (!Number.isInteger(userIndex)) {
        throw new TypeError('The field userIndex should be an integer');
    }
    if ((userIndex < 0) || (userIndex >= ratings.length)) {
        throw new RangeError('User index out of rage');
    }
}
function checkRatingValues(ratingMatrix) {
    return true;
}
// Global API functions
/**
 * Generate recommendations for a user.
 * @param {array} ratings Same definition as in the collaborativeFilter function.
 * @param {array} coMatrix A co-occurrence matrix
 * @param {number} userIndex The index of the user you want to know which items
 * he or she has rated.
 * @returns {array} An array of item indices sorted in how much well recommended
 * the item is.
 */
function getRecommendations(ratings, coMatrix, userIndex) {
    let ratingsMatrix;
    try {
        ratingsMatrix = math.matrix(ratings);
    }
    catch (error) {
        throw new RangeError(error);
    }
    const numItems = ratingsMatrix.size()[1];
    typeCheckUserIndex(userIndex, ratings);
    const ratedItemsForUser = getRatedItemsForUser(ratings, userIndex, numItems);
    const numRatedItems = ratedItemsForUser.length;
    const similarities = math.zeros(numRatedItems, numItems);
    for (let rated = 0; rated < numRatedItems; rated += 1) {
        for (let item = 0; item < numItems; item += 1) {
            similarities.set([rated, item], coMatrix.get([ratedItemsForUser[rated], item])
                + similarities.get([rated, item]));
        }
    }
    // Sum of each row in similarity matrix becomes one row:
    let recommendations = math.zeros(numItems);
    for (let y = 0; y < numRatedItems; y += 1) {
        for (let x = 0; x < numItems; x += 1) {
            recommendations.set([x], recommendations.get([x]) + similarities.get([y, x]));
        }
    }
    recommendations = math.dotDivide(recommendations, numRatedItems);
    const rec = recommendations.toArray();
    let recSorted = recommendations.toArray();
    recSorted.sort((a, b) => b - a);
    if (ONLY_RECOMMEND_FROM_SIMILAR_TASTE) {
        recSorted = recSorted.filter((element) => element !== 0);
    }
    let recOrder = recSorted.map((element) => {
        const index = rec.indexOf(element);
        rec[index] = null; // To ensure no duplicate indices in the future iterations.
        return index;
    });
    recOrder = recOrder.filter((index) => !ratedItemsForUser.includes(index));
    return recOrder;
}
/**
 * Generates a co-occurrence matrix based on the input from the ratings param.
 * @param {array} ratings Same definition as in the collaborativeFilter function.
 * @returns {mathjs Matrix} A two-dimensional co-occurrence matrix with size X x X (X
 * being the number of items that have received at least one rating. The
 * diagonal from left to right should consist of only zeroes.
 */
function createCoMatrix(ratings) {
    let ratingsMatrix;
    try {
        ratingsMatrix = math.matrix(ratings);
    }
    catch (error) {
        throw new RangeError(error);
    }
    checkRatingValues(ratingsMatrix);
    const nUsers = ratingsMatrix.size()[0];
    const nItems = ratingsMatrix.size()[1];
    const coMatrix = math.zeros(nItems, nItems);
    // const normalizerMatrix = math.zeros(nItems, nItems)
    const normalizerMatrix = math.identity(nItems);
    for (let y = 0; y < nUsers; y += 1) {
        // User
        for (let x = 0; x < (nItems - 1); x += 1) {
            // Items in the user
            for (let index = x + 1; index < nItems; index += 1) {
                // Co-occurrence
                if (ratings[y][x] === 1 && ratings[y][index] === 1) {
                    coMatrix.set([x, index], coMatrix.get([x, index]) + 1);
                    coMatrix.set([index, x], coMatrix.get([index, x]) + 1); // mirror
                }
                if (NORMALIZE_ON_POPULARITY && (ratings[y][x] === 1 || ratings[y][index] === 1)) {
                    normalizerMatrix.set([x, index], normalizerMatrix.get([x, index]) + 1);
                    normalizerMatrix.set([index, x], normalizerMatrix.get([index, x]) + 1);
                }
            }
        }
    }
    return NORMALIZE_ON_POPULARITY ? normalizeCoMatrix(coMatrix, normalizerMatrix) : coMatrix;
}
/**
 * This function starts the collaborative filtering process.
 * @param {array} ratings - A two-dimensional array of consisting of the user
 * ratings. The array should be of the following format:
 *           I0 I1 I2 . . .
 *          [
 *      U0  [1  1  1  .  .  .],
 *      U1  [1  0  1  .  .  .],
 *      U2  [1  0  0  .  .  .],
 *      .   [.  .  .  .  .  .],
 *      .   [.  .  .  .  .  .],
 *      .   [.  .  .  .  .  .],
 *          ]
 * where IX is an item and UY is a user. Therefor, the size of the matrix
 * be X x Y. The values in the matrix should be the rating for a given user.
 * If the user has not rated that item, the value should be 0. If the user
 * liked the item, it should be a 1. If disliked, a -1. Dislikes should be
 * implemented last.
 * @returns {array} A two-dimensional array for the normalized co occurrence
 * matrix
 */
function collaborativeFilter(ratings, userIndex) {
    console.log("Ratings inside collaborative filter", ratings);
    if (!Array.isArray(ratings))
        return false;
    const coMatrix = createCoMatrix(ratings);
    const recommendations = getRecommendations(ratings, coMatrix, userIndex);
    return recommendations;
}
exports.collaborativeFilter = collaborativeFilter;
//# sourceMappingURL=cf.js.map