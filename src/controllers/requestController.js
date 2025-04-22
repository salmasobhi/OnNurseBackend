const AcceptRequest = require('../models/AcceptRequest');
const Request = require('../models/requestModel');
const mongoose = require('mongoose');



exports.createRequest = async (req, res) => {
  try {
      // console.log("Received Data:", req.body); // التحقق من البيانات القادمة

      const { user_id, title, description, phone, images } = req.body;

      if (!user_id) {
          return res.status(400).json({ message: "User ID is required" });
      }

      const newRequest = new Request({
          user_id,
          title,
          description,
          phone,
          images,
          status: "open"
      });

      // console.log("New Request Before Save:", newRequest);

      const savedRequest = await newRequest.save();
      res.status(201).json(savedRequest);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};


// exports.createRequest = async (req, res) => {
//   try {
//       console.log("Received Data:", req.body);

//       const { user_id, title, description, price, images, status } = req.body;

//       if (!title || !price) {
//           return res.status(400).json({ message: "title and price are required" });
//       }

//       const newRequest = new Request({
//           user_id,
//           title,       // ✅ تأكدي أن title يتم تمريره هنا
//           description,
//           price,       // ✅ تأكدي أن price يتم تمريره هنا
//           images,
//           status
//       });

//       console.log("New Request Before Save:", newRequest);  // ✅ لمراقبة البيانات

//       await newRequest.save();

//       res.status(201).json({ message: "Request created successfully", newRequest });
//   } catch (error) {
//       console.error("Error creating request:", error);
//       res.status(500).json({ message: "Server error", error });
//   }
// };


exports.getAllRequests = async (req, res) => {
  try {
      const requests = await Request.find(); 
      const listRequests = [];

      for (let request of requests) {
        const acceptedRequest = await AcceptRequest.findOne({ request_id: request._id, nurse_id: req.user.id }); 
      
        // console.log(acceptedRequest);
        listRequests.push({
          ...request.toJSON(),
          accepted: !!acceptedRequest,
          approved: acceptedRequest?.status === 'approved',
        });
      }

      res.status(200).json(listRequests); // أرسل listRequests بدلاً من requests
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
  }
};


// exports.getRequestById = async (req, res) => {
//     try {
//         const request = await Request.findById(req.params.id).populate('user_id').populate('reviews');
//         if (!request) return res.status(404).json({ message: 'Request not found' });
//         res.status(200).json(request);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };


exports.getRequestById = async (req, res) => {
    try {
        // تحقق مما إذا كان الـ ID صالحًا
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid Request ID" });
        }
        // console.log("🔍 Request Model:", Request);
        const request = await Request.findById(req.params.id)
            .populate("user_id");
            

        if (!request) return res.status(404).json({ message: "Request not found" });
        res.status(200).json(request);
    } catch (error) {
        console.error("❌ Error fetching request:", error);
        res.status(500).json({ error: error.message });
    }
};

// /////////////////////////////////////////////////////////////////
exports.getRequestsByUserId = async (req, res) => {


  try {
      const requests = await Request.find({ user_id: req.params.userId }).populate('user_id'); 
      

      res.status(200).json(requests); 
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};


// تحديث طلب معين
exports.updateRequest = async (req, res) => {
    try {
        console.log("📌 Request Data Being Sent To Backend:", req.body);

        // Remove status from update data if it exists
        const updateData = { ...req.body };
        delete updateData.status;

        const request = await Request.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            { new: true }
        );

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        res.status(200).json(request);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// حذف طلب معين
exports.deleteRequest = async (req, res) => {
    try {
        const request = await Request.findByIdAndDelete(req.params.id);
        if (!request) return res.status(404).json({ message: 'Request not found' });
        res.status(200).json({ message: 'Request deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.updateRequestStatus = async (req, res) => {
  try {
      const { status } = req.body;
      const validStatuses = ["open", "in_progress", "closed"];

      if (!validStatuses.includes(status)) {
          return res.status(400).json({ message: "Invalid status value" });
      }

      const request = await Request.findByIdAndUpdate(
          req.params.id,
          { status, updatedAt: Date.now() },
          { new: true }
      );

      if (!request) return res.status(404).json({ message: "Request not found" });

      res.status(200).json({ message: "Status updated successfully", request });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};
