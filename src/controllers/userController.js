
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// تسجيل مستخدم جديد (Register)
exports.registerUser = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      dob,
      country,
      state,
      city,
      is_nurse,
      profile_picture,
      user_name,
      email,
      password,
      country_code,
      mobile_number,
    } = req.body;
    
    // التحقق من وجود مستخدم بنفس الإيميل
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    existingUser = await User.findOne({ user_name });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }
    
    // تشفير كلمة المرور
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // إنشاء مستخدم جديد
    const newUser = new User({
      first_name,
      last_name,
      dob,
      country,
      state,
      city,
      is_nurse,
      profile_picture,
      user_name,
      email,
      password: hashedPassword,
      country_code,
      mobile_number,
    });
    
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// تسجيل الدخول (Login)
// exports.loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
    
//     // البحث عن المستخدم حسب الإيميل
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ error: 'Invalid email or password' });
//     }
    
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ error: 'Invalid email or password' });
//     }
    
//     // إنشاء التوكن
//     // تأكدي من ضبط متغير البيئة JWT_SECRET في ملف .env
//     const payload = {
//       id: user._id,
//       email: user.email,
//       is_nurse: user.is_nurse
//     };
    
//     const token = jwt.sign({ id: user._id, isNurse: user.is_nurse },payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    
//     res.status(200).json({ message: 'Login successful', token });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // البحث عن المستخدم حسب الإيميل
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // إنشاء التوكن
    const payload = {
      id: user._id,
      email: user.email,
      is_nurse: user.is_nurse
    };
    
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// exports.loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
    
//     // البحث عن المستخدم حسب الإيميل
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ error: 'Invalid email or password' });
//     }
    
//     // مقارنة كلمة المرور
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ error: 'Invalid email or password' });
//     }
    
//     // هنا ممكن تضيفي إصدار توكن JWT، لكن لأبسط نموذج هنرجع بيانات المستخدم فقط
//     res.status(200).json({ message: 'Login successful', user });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// جلب كل المستخدمين
exports.getAllUsers = async (req, res) => {
  try {
    // استبعاد كلمة المرور من النتيجة
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// تحديث بيانات مستخدم معين
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// حذف مستخدم معين
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user.id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
