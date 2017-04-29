/**
 * Created by Admin on 23.02.2017.
 */
import { Mongo } from 'meteor/mongo';

export const MessagesDB = new Mongo.Collection('messages');
export const StickersDB = new Mongo.Collection('stickers');
export const ImagesDB = new Mongo.Collection('images');
export const AccountsDB = new Mongo.Collection('accounts');
export const NotesDB = new Mongo.Collection('notes');