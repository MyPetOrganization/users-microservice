import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

/**
 * Represents a user entity in the system.
*/
@Entity('users')
export class User {
    /**
     * The user's unique identifier.
     * @example 1
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * The user's name.
     * @example John Doe
     */
    @Column({ nullable: false })
    public name: string;

    /**
     * The user's email.
     * @example johndoe@example.com
     */
    @Column({ unique: true, nullable: false },)
    public email: string;

    /**
     * The user's password.
     * @example password123
     */
    @Column({ nullable: false})
    public password: string;

    /**
     * The user's role.
     * @example buyer
     */
    @Column({ nullable: false})
    public role: string;

    /**
     * URL of the user's profile image.
     * @example https://example.com/profile.jpg
     */
    @Column({nullable: true })
    public profileImage: string;

    /**
     * The user's favorite movie.
     * @example Fast and Furious
     */
    @Column({ nullable: false})
    favoriteMovie: string;

    /**
     * The date and time the user was created.
     * @example 2021-06-01T12:00:00.000Z
     */
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    public createdAt: Date;

    /**
     * The date and time the user was last updated.
     * @example 2021-06-01T12:00:00.000Z
     */
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
    public updatedAt: Date;
       
    /**
     * The date and time the user was deleted.
     * @example 2021-06-01T12:00:00.000Z
     */
    @DeleteDateColumn()
    public deletedAt: Date;
}