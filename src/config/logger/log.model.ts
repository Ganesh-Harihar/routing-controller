import { Schema, Document } from 'mongoose';
import * as mongoose from 'mongoose';
/***
 * Log Class
 */
export type Log = Document & {
  service: string,
  user: string,
  organization: string,
  message: string,
  type: string,
  parseType: string,
  data: any,
  limit: number,
  createdAt: Date,
  updatedAt: Date
};

const logSchema = new Schema({
  /**
   * Service Id
   */
  service: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.Types.ObjectId,
  },
  organization: {
    type: Schema.Types.ObjectId,
  },
  message: {
    type: String,
    default: '',
    trim: true
  },
  type: {
    type: String,
    enum: [
      'ERROR',
      'WARN',
      'INFO',
      'AUDIT_TRAIL',
      'UNDEFINED'
    ],
    default: 'UNDEFINED'
  },
  parseType: String,
  data: {
    /*  related data to the ParseType.
    *   Push variables/objects onto this object.
    *   Parse will be different for every service and will have a log parser if needed.
    */
  },
  /*
   * Number of left tries
   */
  limit: {
    type: Number,
    default: 1
  }

}, {
  timestamps: true,
  collection: 'app_logs'
});

export const LogSchema = mongoose.model<Log>('Log', logSchema);
