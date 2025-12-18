import User from '../models/user.model';

import notificationService from '../services/notification.service';
import FireBaseService from '../services/fireBaseNotification.service'

const fireBaseService = new FireBaseService();
class notificationForm {
  constructor() {

  }
  async noticationMessage(req) {
    let params = {};
    let user = await User.findOne({ active: true, email: req.request.userEmail })
    if (user) {
      params.registrationTokens = user.fireBaseTokens;
      params.name = user.userName;
      if (req.activityKey === 'requestApproved') {
        let payload = {
          notification: {
            title: "Appointment approved",
            body: `Your request to book an appointment with ${req.request.doctorName} on ${req.request.date} at ${req.request.time} ha been approved `
          }
        }
        params.payload = payload;
      }
      if (req.activityKey === 'requestRejected') {
        let payload = {
          notification: {
            title: "Appointment Rejected",
            body: `Your request to book an appointment with ${req.request.doctorName} on ${req.request.date} at ${req.request.time} ha been rejected `
          }
        }
        params.payload = payload;
      }
      await notificationService.createNotification(req, user, params.payload);
      await fireBaseService.sendNotifications(params, req);
    }
  }

}

export default notificationForm