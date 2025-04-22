
const express = require("express");
const router = express.Router();
const { 
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
  getPatientRequestsWithOffers
} = require("../controllers/acceptRequestController");

// إنشاء طلب قبول جديد
const verifyToken = require("../middlewares/auth");
router.post("/", verifyToken, createAcceptRequest);

// Accept and update routes
router.put("/:id/accept", acceptRequest);
router.put("/:id/update-details", updateOfferDetails);

// Service management routes
router.put("/:id/start", startService);
router.put("/:id/request-completion", verifyToken, requestCompletion); // Added verifyToken
router.put("/:id/confirm-completion", confirmCompletion);

// Get routes
router.get("/", getAcceptRequests);
router.get("/:id", getAcceptRequestById);
router.get('/nurse/:nurseId', getOffersByNurseId);
router.get("/offers/:request_id", getAllOffersForRequest);
router.get('/user/:userId/requests-with-offers', getPatientRequestsWithOffers);
// Delete route
router.delete("/:request_id", deleteAcceptRequest);

module.exports = router;
