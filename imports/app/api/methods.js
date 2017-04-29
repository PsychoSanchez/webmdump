/**
 * Created by Admin on 29.04.2017.
 */
import {
  AccountsDB,
  ImagesDB,
  MessagesDB,
  NotesDB,
  StickersDB
} from './database';

/**
 * Secure methods for data transfer over DDP
 * https://guide.meteor.com/methods.html
 */

Meteor.methods({
  'chat.sendMessage'({user, userId, message, sendDate, ip}){
    new SimpleSchema({
      user,
      userId: {type: Number},
      message: {type: String},
      sendDate: {type: Date},
      ip
    }).validate({
      userId,
      message,
      sendDate
    });

    // TODO: User permissions check here

    MessagesDB.insert({
      user: name ? name : "Anon",
      userID: userId,
      message: message,
      sendDate: sendDate,
      ip: ip
    });
  }
});