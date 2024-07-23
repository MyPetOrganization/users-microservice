export interface ResetPasswordPayload {
    /**
     * The user's email.
     */
    email: string;
    /**
     * The user's new password.
     */
    newPassword: string;
    /**
     * The user's security question.
     */
    favoriteMovie: string;

}