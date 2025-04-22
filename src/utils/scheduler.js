const schedule = require("node-schedule");
const AcceptRequest = require("../models/AcceptRequest");

const scheduleAutoComplete = async (acceptRequestId, delayInMinutes = 24 * 60) => {
  try {
    const acceptRequest = await AcceptRequest.findById(acceptRequestId);
    if (!acceptRequest || acceptRequest.status !== "waiting-confirmation") {
      console.log(`⚠️ العرض ${acceptRequestId} ليس في وضع "waiting-confirmation"`);
      return;
    }

    const completeTime = new Date(Date.now() + delayInMinutes * 60000);

    schedule.scheduleJob(acceptRequestId, completeTime, async function () {
      try {
        const updatedAcceptRequest = await AcceptRequest.findById(acceptRequestId);
        if (!updatedAcceptRequest || updatedAcceptRequest.status !== "waiting-confirmation") {
          return;
        }

        updatedAcceptRequest.status = "completed";
        await updatedAcceptRequest.save();

        console.log(`✅ العرض ${acceptRequestId} تم إنهاؤه تلقائيًا بعد 24 ساعة`);
      } catch (error) {
        console.error("❌ خطأ في إنهاء العرض تلقائيًا:", error);
      }
    });

    console.log(`🕒 تم ضبط مؤقت لإنهاء العرض ${acceptRequestId} بعد 24 ساعة`);
  } catch (error) {
    console.error("❌ خطأ أثناء جدولة العرض:", error);
  }
};

module.exports = { scheduleAutoComplete };
