
import { Model } from "mongoose";
/**
 * Slug check from db if already exists then generate few slug relevant to slug
 * @param {string} slug
 * @param {string} db instance of db
 * @returns {string | boolean} slug
 *
 */
type modelType = {
    slug: string;}
type Slug = <T>(slug: string, db: Model<T>) => Promise<string>;

const slugGenrator = async <T extends modelType>(slug: string, db: Model<T>): Promise<string> => {
    const slugRegex = new RegExp(`^${slug}`);
    /* Check if slug already exists */
    const rgexSlug = new RegExp(slugRegex);
    const slugExists = await db.find({slug: rgexSlug});
    const slugArray =slugExists.map((item: T) => item.slug);
    if (slugExists && slugArray.length > 0) {
        const newSlugSuggestion = slug + "_" + Math.floor(Math.random() * 1000);
        console.log(newSlugSuggestion);
        const slugIsAlreadyExists = slugArray.includes(newSlugSuggestion);
        return slugIsAlreadyExists ? slugGenrator(newSlugSuggestion, db) : newSlugSuggestion;
    }
    return slug;
};
export default slugGenrator;
