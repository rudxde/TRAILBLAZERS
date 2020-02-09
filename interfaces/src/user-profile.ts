/**
 * Represents an user-profile.
 *
 * @export
 * @interface IUserProfile
 */
export interface IUserProfile {
    /**
     * the user-id.
     *
     * @type {string}
     * @memberof IUserProfile
     */
    id: string;
    /**
     * Has the user the same id, as the login.
     *
     * @type {boolean}
     * @memberof IUserProfile
     */
    isMe: boolean;
    /**
     * Is the user an friend of the loggedIn user.
     *
     * @type {boolean}
     * @memberof IUserProfile
     */
    isMyFriend: boolean;
    firstName: string;
    lastName: string;
    nickName: string;
    email: string;
    personalScores: IPersonalScores;
    /**
     * Path/ Url to the profile-picture
     *
     * @type {string}
     * @memberof IUserProfile
     */
    picturePath: string;
    /**
     * An rank of the user showing how experienced he is.
     *
     * @type {number}
     * @memberof IUserProfile
     */
    rank: number;
    /**
     * Hikes th user has done. Used for recommendations.
     *
     * @type {ICompletedHike[]}
     * @memberof IUserProfile
     */
    hikesCompleted: ICompletedHike[];
}

export interface ICompletedHike {
    id: string;
    rating: number;
}

export interface IPersonalScores {

}
