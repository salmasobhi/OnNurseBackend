

const AcceptRequest = require('../models/AcceptRequest');
const Request = require('../models/requestModel');
const User = require('../models/User');
const { scheduleAutoComplete } = require("../utils/scheduler");
const mongoose = require("mongoose");
const Review = require('../models/Review');
const acceptRequest = async (req, res) => {
  try {
    const { id } = req.params; 
    const { price, message } = req.body; 

    console.log("📩 البيانات المستلمة:", { price, message });

    const updatedRequest = await AcceptRequest.findByIdAndUpdate(
      id,
      { 
        status: "approved",
        price, 
        message
      },
      { new: true, runValidators: true } 
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    console.log("✅ تم قبول العرض:", updatedRequest);
    res.status(200).json(updatedRequest);
  } catch (error) {
    console.error("❌ خطأ أثناء قبول الطلب:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const startService = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedAcceptRequest = await AcceptRequest.findByIdAndUpdate(
      id,
      { status: "in-progress" },
      { new: true }
    );

    if (!updatedAcceptRequest) {
      return res.status(404).json({ message: "Accept request not found" });
    }

    await Request.findByIdAndUpdate(
      updatedAcceptRequest.request_id,
      { status: "in-progress" }
    );

    console.log("🔄 الخدمة قيد التنفيذ:", updatedAcceptRequest);
    res.status(200).json(updatedAcceptRequest);  // Fixed this line
  } catch (error) {
    console.error("❌ خطأ أثناء بدء التنفيذ:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const requestCompletion = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedAcceptRequest = await AcceptRequest.findByIdAndUpdate(
      id,
      { status: "waiting-confirmation" },
      { new: true }
    ).populate('request_id');

    if (!updatedAcceptRequest) {
      return res.status(404).json({ message: "Accept request not found" });
    }

    await Request.findByIdAndUpdate(
      updatedAcceptRequest.request_id,
      { status: "waiting-confirmation" }
    );

    try {
      await scheduleAutoComplete(id);  // Changed this line
      console.log("⏳ تم جدولة الإنهاء التلقائي للطلب:", id);
    } catch (scheduleError) {
      console.error("❌ خطأ في جدولة الإنهاء التلقائي:", scheduleError);
    }

    res.status(200).json(updatedAcceptRequest);
  } catch (error) {
    console.error("❌ خطأ أثناء طلب إنهاء الخدمة:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 🔹 عند تأكيد المريض
const confirmCompletion = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID format before conversion
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid request ID format" });
    }

    const updatedRequest = await AcceptRequest.findByIdAndUpdate(
      id,  // MongoDB will automatically convert valid ID string to ObjectId
      { status: "completed" },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    await Request.findByIdAndUpdate(
      updatedRequest.request_id,
      { status: "closed" }
    );

    console.log("✅ الخدمة مكتملة:", updatedRequest);
    res.status(200).json(updatedRequest);
  } catch (error) {
    console.error("❌ خطأ أثناء تأكيد الإنهاء:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createAcceptRequest = async (req, res) => {
  try {
    const { request_id, price, message } = req.body;

    if (!request_id || price === undefined || !message) {
      return res.status(400).json({ error: "Missing required fields: request_id, price, or message" });
    }

    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ error: "Price must be a positive number" });
    }

    console.log("Price:", price);
    console.log("Message:", message);

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: Nurse ID is missing" });
    }
    const nurse_id = req.user.id;

    const existingRequest = await Request.findById(request_id);
    if (!existingRequest) {
      return res.status(404).json({ error: "Request not found" });
    }

    const existingAcceptRequest = await AcceptRequest.findOne({ nurse_id, request_id });
    if (existingAcceptRequest) {
      return res.status(400).json({ error: "You have already accepted this request" });
    }

    const newAcceptRequest = new AcceptRequest({ nurse_id, request_id, price, message });
    await newAcceptRequest.save();

    console.log("New AcceptRequest:", newAcceptRequest);
    res.status(201).json(newAcceptRequest);
  } catch (error) {
    console.error("Error in createAcceptRequest:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

const getAcceptRequests = async (req, res) => {
  try {
    const acceptedRequests = await AcceptRequest.find({
      status: { $in: ["accepted", "in-progress"] }
    })
      .populate("request_id")
      .populate("nurse_id", "name email");

    res.status(200).json(acceptedRequests);
  } catch (error) {
    console.error("Error in getAcceptRequests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAcceptRequestById = async (req, res) => {
  try {
    console.log("Fetching request with ID:", req.params.id);

    const acceptRequest = await AcceptRequest.findById(req.params.id)
      .populate("request_id")
      .populate("nurse_id", "name email");

    if (!acceptRequest) {
      return res.status(404).json({ error: "Accept request not found" });
    }

    res.status(200).json(acceptRequest);
  } catch (error) {
    console.error("Error in getAcceptRequestById:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteAcceptRequest = async (req, res) => {
  try {
    const { request_id } = req.params;

    if (!request_id) {
      return res.status(400).json({ message: "request_id is required" });
    }

    const deletedRequest = await AcceptRequest.findOneAndDelete({ _id: request_id });

    if (!deletedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({ message: "Request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getOffersByNurseId = async (req, res) => {
  try {
    const offers = await AcceptRequest.find({ nurse_id: req.params.nurseId })
      .populate("request_id")
      .populate("nurse_id", "first_name last_name email");

    res.status(200).json(offers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllOffersForRequest = async (req, res) => {
  const { request_id } = req.params;
  console.log("Request ID received:", request_id);

  try {
    // Fix truncated IDs if possible
    const fixedId = request_id.padEnd(24, '0');
    
    if (!mongoose.Types.ObjectId.isValid(fixedId)) {
      console.error("Invalid ID format. Original:", request_id, "Fixed attempt:", fixedId);
      return res.status(400).json({ 
        message: "Invalid request ID format",
        details: "ID must be a 24 character hex string"
      });
    }

    const offers = await AcceptRequest.find({ request_id: fixedId })
      .populate("nurse_id", "first_name last_name")
      .select("price message status nurse_id accepted_at");
    
    if (!offers || offers.length === 0) {
      return res.status(200).json({ message: "لا توجد عروض لهذا الطلب" });
    }

    // Rest of the function remains the same
    const offersWithDetails = await Promise.all(offers.map(async offer => {
      const nurseRating = await Review.getNurseRating(offer.nurse_id._id);
      return {
        _id: offer._id,
        nurse: {
          _id: offer.nurse_id._id,
          first_name: offer.nurse_id.first_name,
          last_name: offer.nurse_id.last_name,
          averageRating: nurseRating.averageRating || 0,
          numberOfReviews: nurseRating.numberOfReviews || 0
        },
        price: offer.price,
        message: offer.message,
        status: offer.status,
        created_at: offer.accepted_at
      };
    }));

    res.status(200).json(offersWithDetails);
  } catch (error) {
    console.error("❌ Error fetching offers:", error);
    res.status(500).json({ message: "حدث خطأ أثناء جلب العروض" });
  }
};

const updateOfferDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { price, message } = req.body;

    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ error: "Price must be a positive number" });
    }

    const updatedRequest = await AcceptRequest.findByIdAndUpdate(
      id,
      { 
        $set: {
          price,
          message
        }
      },
      { new: true, runValidators: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    console.log("✅ تم تحديث تفاصيل العرض:", updatedRequest);
    res.status(200).json(updatedRequest);
  } catch (error) {
    console.error("❌ خطأ في تحديث العرض:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPatientRequestsWithOffers = async (req, res) => {
  try {
    const { userId } = req.params;
    const objectId = new mongoose.Types.ObjectId(userId);

    // ✅ جلب الطلبات الخاصة بالمريض
    const requests = await Request.find({ user_id: objectId });

    if (!requests.length) {
      return res.status(404).json({ message: "لا توجد طلبات لهذا المستخدم" });
    }

    // ✅ جلب العروض المرتبطة بهذه الطلبات من AcceptRequest
    const requestIds = requests.map(req => req._id);
    const offers = await AcceptRequest.find({
      request_id: { $in: requestIds },
      status: "waiting-confirmation"
    }).populate("nurse_id", "first_name last_name email");

    // ✅ تنسيق البيانات بحيث يكون لكل طلب عروضه
    const formattedRequests = requests.map(request => ({
      _id: request._id,
      title: request.title || "غير محدد",
      description: request.description || "لا يوجد وصف",
      status: request.status || "غير معروف",
      created_at: request.createdAt,
      offers: offers
        .filter(offer => offer.request_id.toString() === request._id.toString())
        .map(offer => ({
          _id: offer._id,  // Added offer ID here
          price: offer.price,
          message: offer.message,
          status: offer.status,
          nurse: {
            first_name: offer.nurse_id?.first_name || "غير معروف",
            last_name: offer.nurse_id?.last_name || "",
            email: offer.nurse_id?.email || "غير متوفر"
          }
        }))
    }));

    res.status(200).json(formattedRequests);
  } catch (error) {
    console.error("❌ خطأ في جلب طلبات المريض:", error);
    res.status(500).json({ message: "حدث خطأ أثناء جلب الطلبات" });
  }
};



// ✅ تأكيد أن المسار في الراوتر صحيح




// Update module.exports
module.exports = {
  createAcceptRequest,
  getAcceptRequests,
  getAcceptRequestById,
  deleteAcceptRequest,
  acceptRequest,
  getOffersByNurseId,
  getAllOffersForRequest,
  startService,
  requestCompletion,
  confirmCompletion,
  updateOfferDetails,
  getPatientRequestsWithOffers,
};
