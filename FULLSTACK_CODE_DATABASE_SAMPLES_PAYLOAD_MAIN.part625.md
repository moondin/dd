---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 625
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 625 of 695)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - payload-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/payload-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: ar.js]---
Location: payload-main/test/localization-rtl/ar.js

```javascript
export const ar = {
  authentication: {
    account: 'الحساب',
    accountOfCurrentUser: 'حساب المستخدم الحالي',
    alreadyActivated: 'تمّ التّفعيل بالفعل',
    alreadyLoggedIn: 'تمّ تسجيل الدّخول بالفعل',
    apiKey: 'مفتاح API',
    backToLogin: 'العودة لتسجيل الدخول',
    beginCreateFirstUser: 'للبدء, قم بإنشاء المستخدم الأوّل.',
    changePassword: 'تغيير كلمة المرور',
    checkYourEmailForPasswordReset:
      'تحقّق من بريدك الإلكتروني بحثًا عن رابط يسمح لك بإعادة تعيين كلمة المرور الخاصّة بك بشكل آمن.',
    confirmGeneration: 'تأكيد التّوليد',
    confirmPassword: 'تأكيد كلمة المرور',
    createFirstUser: 'إنشاء المستخدم الأوّل',
    emailNotValid: 'البريد الإلكتروني غير صالح',
    emailSent: 'تمّ ارسال البريد الإلكتروني',
    enableAPIKey: 'تفعيل مفتاح API',
    failedToUnlock: 'فشل فتح القفل',
    forceUnlock: 'إجبار فتح القفل',
    forgotPassword: 'نسيت كلمة المرور',
    forgotPasswordEmailInstructions:
      'يرجى إدخال البريد الالكتروني أدناه. ستتلقّى رسالة بريد إلكتروني تحتوي على إرشادات حول كيفيّة إعادة تعيين كلمة المرور الخاصّة بك.',
    forgotPasswordQuestion: 'هل نسيت كلمة المرور؟',
    generate: 'توليد',
    generateNewAPIKey: 'توليد مفتاح API جديد',
    generatingNewAPIKeyWillInvalidate:
      'سيؤدّي إنشاء مفتاح API جديد إلى <1> إبطال </ 1> المفتاح السّابق. هل أنت متأكّد أنّك تريد المتابعة؟',
    lockUntil: 'قفل حتى',
    logBackIn: 'تسجيل الدّخول من جديد',
    logOut: 'تسجيل الخروج',
    loggedIn: 'لتسجيل الدّخول مع مستخدم آخر ، يجب عليك <0> تسجيل الخروج </0> أوّلاً.',
    loggedInChangePassword:
      'لتغيير كلمة المرور الخاصّة بك ، انتقل إلى <0>حسابك</0> وقم بتعديل كلمة المرور هناك.',
    loggedOutInactivity: 'لقد تمّ تسجيل الخروج بسبب عدم النّشاط.',
    loggedOutSuccessfully: 'لقد تمّ تسجيل خروجك بنجاح.',
    login: 'تسجيل الدخول',
    loginAttempts: 'محاولات تسجيل الدخول',
    loginUser: 'تسجيل دخول المستخدم',
    loginWithAnotherUser: 'لتسجيل الدخول مع مستخدم آخر ، يجب عليك <0> تسجيل الخروج </0> أوّلاً.',
    logout: 'تسجيل الخروج',
    logoutUser: 'تسجيل خروج المستخدم',
    newAPIKeyGenerated: 'تمّ توليد مفتاح API جديد.',
    newAccountCreated:
      'تمّ إنشاء حساب جديد لتتمكّن من الوصول إلى <a href="{{serverURL}}"> {{serverURL}} </a> الرّجاء النّقر فوق الرّابط التّالي أو لصق عنوان URL أدناه في متصفّحّك لتأكيد بريدك الإلكتروني : <a href="{{verificationURL}}"> {{verificationURL}} </a> <br> بعد التّحقّق من بريدك الإلكتروني ، ستتمكّن من تسجيل الدّخول بنجاح.',
    newPassword: 'كلمة مرور جديدة',
    resetPassword: 'إعادة تعيين كلمة المرور',
    resetPasswordExpiration: 'انتهاء صلاحيّة إعادة تعيين كلمة المرور',
    resetPasswordToken: 'رمز إعادة تعيين كلمة المرور',
    resetYourPassword: 'إعادة تعيين كلمة المرور الخاصّة بك',
    stayLoggedIn: 'ابق متّصلًا',
    successfullyUnlocked: 'تمّ فتح القفل بنجاح',
    unableToVerify: 'غير قادر على التحقق من',
    verified: 'تمّ التحقّق',
    verifiedSuccessfully: 'تمّ التحقّق بنجاح',
    verify: 'قم بالتّحقّق',
    verifyUser: 'قم بالتّحقّق من المستخدم',
    verifyYourEmail: 'قم بتأكيد بريدك الألكتروني',
    youAreInactive:
      'لم تكن نشطًا منذ فترة قصيرة وسيتمّ تسجيل خروجك قريبًا تلقائيًا من أجل أمنك. هل ترغب في البقاء مسجّلا؟',
    youAreReceivingResetPassword:
      'أنت تتلقّى هذا البريد الالكتروني لأنّك (أو لأنّ شخص آخر) طلبت إعادة تعيين كلمة المرور لحسابك. الرّجاء النّقر فوق الرّابط التّالي ، أو لصق هذا الرّابط في متصفّحك لإكمال العمليّة:',
    youDidNotRequestPassword:
      'إن لم تطلب هذا ، يرجى تجاهل هذا البريد الإلكتروني وستبقى كلمة مرورك ذاتها بدون تغيير.',
  },
  error: {
    accountAlreadyActivated: 'لقد تمّ تنشيط هذا الحساب بالفعل.',
    autosaving: 'حدث خطأ أثناء الحفظ التّلقائي لهذا المستند.',
    correctInvalidFields: 'الرّجاء تصحيح الحقول الغير صالحة.',
    deletingFile: 'حدث خطأ أثناء حذف الملفّ.',
    deletingTitle: 'حدث خطأ أثناء حذف {{title}}. يرجى التحقّق من اتّصالك والمحاولة مرة أخرى.',
    emailOrPasswordIncorrect: 'البريد الإلكتروني أو كلمة المرور غير صحيح/ة.',
    followingFieldsInvalid_many: 'الحقول التّالية غير صالحة:',
    followingFieldsInvalid_one: 'الحقل التّالي غير صالح:',
    followingFieldsInvalid_other: 'الحقول التالية غير صالحة:',
    incorrectCollection: 'المجموعة غير صحيحة',
    invalidFileType: 'نوع الملفّ غير صالح',
    invalidFileTypeValue: 'نوع الملفّ غير صالح: {{value}}',
    loadingDocument: 'حدث خطأ أثناء تحميل المستند بمعرّف {{id}}.',
    localesNotSaved_one: 'تعذر حفظ الإعدادات المحلية التالية:',
    localesNotSaved_other: 'تعذر حفظ الإعدادات المحلية التالية:',
    missingEmail: 'البريد الإلكتروني مفقود.',
    missingIDOfDocument: 'معرّف المستند المراد تحديثه مفقود.',
    missingIDOfVersion: 'معرّف النسخة مفقود.',
    missingRequiredData: 'توجد بيانات مطلوبة مفقودة.',
    noFilesUploaded: 'لم يتمّ رفع أيّة ملفّات.',
    noMatchedField: 'لم يتمّ العثور على حقل مطابق لـ "{{label}}"',
    noUser: 'لا يوجد مستخدم',
    notAllowedToAccessPage: 'لا يسمح لك الوصول إلى هذه الصّفحة.',
    notAllowedToPerformAction: 'لا يسمح لك القيام بهذه العمليّة.',
    notFound: 'لم يتمّ العثور على المورد المطلوب.',
    previewing: 'حدث خطأ في اثناء معاينة هذا المستند.',
    problemUploadingFile: 'حدث خطأ اثناء رفع الملفّ.',
    tokenInvalidOrExpired: 'الرّمز إمّا غير صالح أو منتهي الصّلاحيّة.',
    unPublishingDocument: 'حدث خطأ أثناء إلغاء نشر هذا المستند.',
    unableToDeleteCount: 'يتعذّر حذف {{count}} من {{total}} {{label}}.',
    unableToUpdateCount: 'يتعذّر تحديث {{count}} من {{total}} {{label}}.',
    unauthorized: 'غير مصرّح لك ، عليك أن تقوم بتسجيل الدّخول لتتمكّن من تقديم هذا الطّلب.',
    unknown: 'حدث خطأ غير معروف.',
    unspecific: 'حدث خطأ.',
    userLocked: 'تمّ قفل هذا المستخدم نظرًا لوجود عدد كبير من محاولات تسجيل الدّخول الغير ناجحة.',
    valueMustBeUnique: 'على القيمة أن تكون فريدة',
    verificationTokenInvalid: 'رمز التحقّق غير صالح.',
  },
  fields: {
    addLabel: 'أضف {{label}}',
    addLink: 'أضف رابط',
    addNew: 'أضف جديد',
    addNewLabel: 'أضف {{label}} جديد',
    addRelationship: 'أضف علاقة',
    addUpload: 'أضف تحميل',
    block: 'وحدة محتوى',
    blockType: 'نوع وحدة المحتوى',
    blocks: 'وحدات المحتوى',
    chooseBetweenCustomTextOrDocument: 'اختر بين إدخال عنوان URL نصّي مخصّص أو الرّبط بمستند آخر.',
    chooseDocumentToLink: 'اختر مستندًا للربط',
    chooseFromExisting: 'اختر من القائمة',
    chooseLabel: 'اختر {{label}}',
    collapseAll: 'طيّ الكلّ',
    customURL: 'URL مخصّص',
    editLabelData: 'عدّل بيانات {{label}}',
    editLink: 'عدّل الرّابط',
    editRelationship: 'عدّل العلاقة',
    enterURL: 'ادخل عنوان URL',
    internalLink: 'رابط داخلي',
    itemsAndMore: '{{items}} و {{count}} أخرى',
    labelRelationship: '{{label}} علاقة',
    latitude: 'خطّ العرض',
    linkType: 'نوع الرّابط',
    linkedTo: 'تمّ الرّبط ل <0>{{label}}</0>',
    longitude: 'خطّ الطّول',
    newLabel: '{{label}} جديد',
    openInNewTab: 'الفتح في علامة تبويب جديدة',
    passwordsDoNotMatch: 'كلمة المرور غير مطابقة.',
    relatedDocument: 'مستند مربوط',
    relationTo: 'ربط ل',
    removeRelationship: 'حذف العلاقة',
    removeUpload: 'حذف المحتوى المرفوع',
    saveChanges: 'حفظ التّغييرات',
    searchForBlock: 'ابحث عن وحدة محتوى',
    selectExistingLabel: 'اختيار {{label}} من القائمة',
    selectFieldsToEdit: 'حدّد الحقول اللتي تريد تعديلها',
    showAll: 'إظهار الكلّ',
    swapRelationship: 'تبديل العلاقة',
    swapUpload: 'تبديل المحتوى المرفوع',
    textToDisplay: 'النصّ الذي تريد إظهاره',
    toggleBlock: 'Toggle block',
    uploadNewLabel: 'رفع {{label}} جديد',
  },
  general: {
    aboutToDelete: 'أنت على وشك حذف {{label}} <1>{{title}}</1>. هل أنت متأكّد؟',
    aboutToDeleteCount_many: 'أنت على وشك حذف {{count}} {{label}}',
    aboutToDeleteCount_one: 'أنت على وشك حذف {{count}} {{label}}',
    aboutToDeleteCount_other: 'أنت على وشك حذف {{count}} {{label}}',
    addBelow: 'أضف في الاسفل',
    addFilter: 'أضف فلتر',
    adminTheme: 'شكل واجهة المستخدم',
    and: 'و',
    ascending: 'تصاعدي',
    automatic: 'تلقائي',
    backToDashboard: 'العودة للوحة التّحكّم',
    cancel: 'إلغاء',
    changesNotSaved: 'لم يتمّ حفظ التّغييرات. إن غادرت الآن ، ستفقد تغييراتك.',
    close: 'إغلاق',
    collections: 'المجموعات',
    columnToSort: 'التّرتيب حسب العامود',
    columns: 'الأعمدة',
    confirm: 'تأكيد',
    confirmDeletion: 'تأكيد الحذف',
    confirmDuplication: 'تأكيد التّكرار',
    copied: 'تمّ النّسخ',
    copy: 'نسخ',
    create: 'إنشاء',
    createNew: 'أنشاء جديد',
    createNewLabel: 'إنشاء {{label}} جديد',
    created: 'تمّ الإنشاء',
    createdAt: 'تمّ الإنشاء في',
    creating: 'يتمّ الإنشاء',
    dark: 'غامق',
    dashboard: 'لوحة التّحكّم',
    delete: 'حذف',
    deletedCountSuccessfully: 'تمّ حذف {{count}} {{label}} بنجاح.',
    deletedSuccessfully: 'تمّ الحذف بنجاح.',
    deleting: 'يتمّ الحذف...',
    descending: 'تنازلي',
    duplicate: 'تكرار',
    duplicateWithoutSaving: 'تكرار بدون حفظ التّغييرات',
    edit: 'تعديل',
    editLabel: 'تعديل {{label}}',
    editing: 'يتمّ التّعديل',
    editingLabel_many: 'يتمّ تعديل {{count}} {{label}}',
    editingLabel_one: 'يتمّ تعديل {{count}} {{label}}',
    editingLabel_other: 'يتمّ تعديل {{count}} {{label}}',
    email: 'البريد الالكتروني',
    emailAddress: 'عنوان البريد الالكتروني',
    enterAValue: 'أدخل قيمة',
    fallbackToDefaultLocale: 'يتمّ استخدام اللّغة الافتراضيّة',
    filter: 'فلتر',
    filterWhere: 'فلتر {{label}} أينما',
    filters: 'فلاتر',
    globals: 'المجموعات العامّة',
    language: 'اللّغة',
    lastModified: 'آخر تعديل في',
    leaveAnyway: 'المغادرة على أيّة حال',
    leaveWithoutSaving: 'المغادرة بدون حفظ',
    light: 'فاتح',
    loading: 'يتمّ التّحميل',
    locales: 'اللّغات',
    moveDown: 'التّحريك إلى الأسفل',
    moveUp: 'التّحريك إلى الأعلى',
    newPassword: 'كلمة مرور جديدة',
    noFiltersSet: 'لم يتمّ تحديد فلتر',
    noLabel: '<لا يوجد {{label}}>',
    noResults:
      'لم يتمّ العثور على {{label}}. إمّا أنّه لا يوجد {{label}} حتّى الآن أو أنّه لا يتطابق أيّ منها مع الفلاتر التّي حدّدتها أعلاه.',
    noValue: 'لا توجد قيمة',
    none: 'None',
    notFound: 'غير معثور عليه',
    nothingFound: 'لم يتمّ العثور على شيء',
    of: 'من',
    or: 'أو',
    order: 'التّرتيب',
    pageNotFound: 'الصّفحة غير موجودة',
    password: 'كلمة المرور',
    payloadSettings: 'الإعدادات',
    perPage: 'لكلّ صفحة: {{limit}}',
    remove: 'إزالة',
    row: 'سطر',
    rows: 'أسطُر',
    save: 'حفظ',
    saving: 'يتمّ الحفظ...',
    searchBy: 'البحث بواسطة {{label}}',
    selectAll: 'اختر الكلّ {{count}} {{label}}',
    selectValue: 'اختر قيمة',
    selectedCount: '{{count}} {{label}} تمّ اختيارها',
    sorryNotFound: 'عذرًا - ليس هناك ما يتوافق مع طلبك.',
    sort: 'ترتيب',
    stayOnThisPage: 'البقاء في هذه الصّفحة',
    submissionSuccessful: 'تمّ التّقديم بنجاح.',
    submit: 'تقديم',
    successfullyCreated: 'تمّ إنشاء {{label}} بنجاح.',
    successfullyDuplicated: 'تمّ التّكرار{{label}} بنجاح.',
    thisLanguage: 'العربيّة',
    titleDeleted: 'تمّ حذف {{label}} "{{title}}" بنجاح.',
    unauthorized: 'غير مصرّح',
    unsavedChangesDuplicate: 'لم تحفظ التّغييرات. هل ترغب في الاستمرار في التّكرار?',
    untitled: 'غير مُعنوَن',
    updatedAt: 'تمّ التحديث في',
    updatedCountSuccessfully: 'تمّ تحديث {{count}} {{label}} بنجاح.',
    updatedSuccessfully: 'تمّ التّحديث بنجاح.',
    updating: 'يتمّ التّحديث',
    uploading: 'يتمّ الرّفع',
    user: 'مستخدم',
    users: 'مستخدمين',
    welcome: 'اهلاً وسهلاً بك',
  },
  operators: {
    contains: 'يحتوي',
    equals: 'يساوي',
    exists: 'موجود',
    isGreaterThan: 'أكبر من',
    isGreaterThanOrEqualTo: 'أكبر أو يساوي',
    isIn: 'موجود في',
    isLessThan: 'أصغر من',
    isLessThanOrEqualTo: 'أصغر أو يساوي',
    isLike: 'هو مثل',
    isNotEqualTo: 'لا يساوي',
    isNotIn: 'غير موجود في',
    near: 'قريب من',
  },
  upload: {
    dragAndDrop: 'قم بسحب وإسقاط ملفّ',
    dragAndDropHere: 'أو اسحب الملفّ وأفلته هنا',
    fileName: 'اسم الملفّ',
    fileSize: 'حجم الملفّ',
    height: 'الطّول',
    lessInfo: 'معلومات أقلّ',
    moreInfo: 'معلومات أكثر',
    selectCollectionToBrowse: 'حدّد مجموعة لاستعراضها',
    selectFile: 'اختر ملفّ',
    sizes: 'الاحجام',
    width: 'العرض',
  },
  validation: {
    emailAddress: 'يرجى إدخال عنوان بريد إلكتروني صالح.',
    enterNumber: 'يرجى إدخال رقم صالح.',
    fieldHasNo: 'هذا الحقل لا يحتوي على {{label}}',
    greaterThanMax: '"{{value}}" هو أكبر من القيمة القصوى المسموحة {{max}}.',
    invalidInput: 'هذا الحقل يحتوي على حقل غير صالح.',
    invalidSelection: 'هذا الحقل يحتوي تحديد غير صالح.',
    invalidSelections: 'هذا الحقل يحتوي التّحديدات الغير صالحة التّلية:',
    lessThanMin: '"{{value}}" هو أصغر من القيمة الدنيا المسموحة {{min}}.',
    longerThanMin: 'يجب أن تكون هذه القيمة أطول من الحدّ الأدنى للطول وهو {{minLength}} حرفًا.',
    notValidDate: '"{{value}}" ليس تاريخًا صالحًا.',
    required: 'هذه الخانة مطلوبه.',
    requiresAtLeast: 'هذه الخانة تتطلب على الأقلّ {{count}} {{label}}.',
    requiresNoMoreThan: 'هذه الخانة تتطلّب ما لا يزيد عن {{count}} {{label}}.',
    requiresTwoNumbers: 'هذه الخانة تتطلّب رقمين.',
    shorterThanMax: 'يجب أن تكون هذه القيمة أقصر من الحدّ الأقصى للطول وهو {{maxLength}} حرفًا.',
    trueOrFalse: 'هذه الخانة يجب أن تكون صحيح او خطأ.',
    validUploadID: 'هذه الخانة ليست معرّف تحميل صالح.',
  },
  version: {
    aboutToPublishSelection: 'أنت على وشك نشر كلّ {{label}} في التّحديد. هل أنت متأكّد؟',
    aboutToRestore:
      'أنت على وشك استرجاع هذا المستند {{label}} إلى الحالة التّي كان عليها في {{versionDate}}.',
    aboutToRestoreGlobal:
      'أنت على وشك استرجاع الاعداد العامّ {{label}} إلى الحالة التي كان عليها في {{versionDate}}.',
    aboutToRevertToPublished: 'أنت على وشك إعادة هذا المستند إلى حالته المنشورة. هل أنت متأكّد؟',
    aboutToUnpublish: 'أنت على وشك إلغاء نشر هذا المستند. هل أنت متأكّد؟',
    aboutToUnpublishSelection: 'أنت على وشك إلغاء نشر كلّ {{label}} في التّحديد. هل أنت متأكّد؟',
    autosave: 'حفظ تلقائي',
    autosavedSuccessfully: 'تمّ الحفظ التّلقائي بنجاح.',
    autosavedVersion: 'النّسخة المحفوظة تلقائياً',
    changed: 'تمّ التّغيير',
    compareVersion: 'مقارنة النّسخة مع:',
    confirmPublish: 'تأكيد النّشر',
    confirmRevertToSaved: 'تأكيد الرّجوع للنسخة المنشورة',
    confirmUnpublish: 'تأكيد إلغاء النّشر',
    confirmVersionRestoration: 'تأكيد إستعادة النّسخة',
    currentDocumentStatus: 'المستند {{docStatus}} الحالي',
    draft: 'مسودّة',
    draftSavedSuccessfully: 'تمّ حفظ المسودّة بنجاح.',
    lastSavedAgo: 'آخر حفظ في {{distance, relativetime(minutes)}}',
    noFurtherVersionsFound: 'لم يتمّ العثور على نسخات أخرى',
    noRowsFound: 'لم يتمّ العثور على {{label}}',
    preview: 'معاينة',
    problemRestoringVersion: 'حدث خطأ في استعادة هذه النّسخة',
    publish: 'نشر',
    publishChanges: 'نشر التّغييرات',
    published: 'تمّ النّشر',
    restoreThisVersion: 'استعادة هذه النّسخة',
    restoredSuccessfully: 'تمّت الاستعادة بنحاح.',
    restoring: 'تتمّ الاستعادة...',
    revertToPublished: 'الرّجوع للنسخة المنشورة',
    reverting: 'يتمّ الاسترجاع...',
    saveDraft: 'حفظ المسودّة',
    selectLocales: 'حدّد اللّغات المراد عرضها',
    selectVersionToCompare: 'حدّد نسخة للمقارنة',
    showLocales: 'اظهر اللّغات:',
    showingVersionsFor: 'يتمّ عرض النًّسخ ل:',
    status: 'الحالة',
    type: 'النّوع',
    unpublish: 'الغاء النّشر',
    unpublishing: 'يتمّ الغاء النّشر...',
    version: 'النّسخة',
    versionCount_many: 'تمّ العثور على {{count}} نُسخ',
    versionCount_none: 'لم يتمّ العثور على أيّ من النّسخ',
    versionCount_one: 'تمّ العثور على {{count}} من النّسخ',
    versionCount_other: 'تمّ العثور على {{count}} نُسخ',
    versionCreatedOn: 'تمّ ﻹنشاء النّسخة في {{version}}:',
    versionID: 'مُعرّف النّسخة',
    versions: 'النُّسَخ',
    viewingVersion: 'يتمّ استعراض نسخة ل {{entityLabel}} {{documentTitle}}',
    viewingVersionGlobal: 'يتمّ استعراض نسخة للاعداد العامّ {{entityLabel}}',
    viewingVersions: 'يتمّ استعراض النُّسَخ ل {{entityLabel}} {{documentTitle}}',
    viewingVersionsGlobal: 'يتمّ استعراض النُّسَخ للاعداد العامّ {{entityLabel}}',
  },
}

export default ar
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: payload-main/test/localization-rtl/config.ts

```typescript
import { fileURLToPath } from 'node:url'
import path from 'path'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
import { ar } from '@payloadcms/translations/languages/ar'
import { de } from '@payloadcms/translations/languages/de'
import { en } from '@payloadcms/translations/languages/en'
import { es } from '@payloadcms/translations/languages/es'

import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { devUser } from '../credentials.js'
import { Posts } from './collections/posts.js'
import { Users } from './collections/users.js'
import deepMerge from './deepMerge.js'

export default buildConfigWithDefaults({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Posts],
  /*i18n: {
    fallbackLng: 'en', // default
    debug: false, // default
    resources: {
      ar: deepMerge(en, ar),
    },
  },*/
  localization: {
    locales: [
      {
        label: 'English',
        code: 'en',
      },
      {
        label: 'Arabic',
        code: 'ar',
        rtl: true,
      },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  i18n: {
    supportedLanguages: {
      ar,
      en,
      es,
      de,
    },
  },
  onInit: async (payload) => {
    await payload.create({
      collection: 'users',
      data: {
        email: devUser.email,
        password: devUser.password,
      },
    })
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
```

--------------------------------------------------------------------------------

---[FILE: deepMerge.ts]---
Location: payload-main/test/localization-rtl/deepMerge.ts

```typescript
/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item: unknown): boolean {
  return Boolean(item && typeof item === 'object' && !Array.isArray(item))
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export default function deepMerge<T extends object, R extends object>(target: T, source: R): T {
  const output = { ...target }
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] })
        } else {
          output[key] = deepMerge(target[key], source[key])
        }
      } else {
        Object.assign(output, { [key]: source[key] })
      }
    })
  }

  return output
}
```

--------------------------------------------------------------------------------

---[FILE: e2e.spec.ts]---
Location: payload-main/test/localization-rtl/e2e.spec.ts

```typescript
// I'm not sure why this suite exists without tests.
// I left some RTL tests in the Lexical suite because they were very lexical-related.
// See: test/lexical/collections/_LexicalFullyFeatured/e2e.spec.ts
// I thought about deleting this folder, but maybe it will be useful to someone in the future.
```

--------------------------------------------------------------------------------

---[FILE: localization.ts]---
Location: payload-main/test/localization-rtl/localization.ts

```typescript
export const localization = {
  locales: [
    {
      label: 'English',
      value: 'en',
    },
    {
      label: 'Arabic',
      value: 'ar',
      rtl: true,
    },
  ],
  defaultLocale: 'en',
  fallback: true,
}
```

--------------------------------------------------------------------------------

---[FILE: payload-types.ts]---
Location: payload-main/test/localization-rtl/payload-types.ts

```typescript
/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

/**
 * Supported timezones in IANA format.
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "supportedTimezones".
 */
export type SupportedTimezones =
  | 'Pacific/Midway'
  | 'Pacific/Niue'
  | 'Pacific/Honolulu'
  | 'Pacific/Rarotonga'
  | 'America/Anchorage'
  | 'Pacific/Gambier'
  | 'America/Los_Angeles'
  | 'America/Tijuana'
  | 'America/Denver'
  | 'America/Phoenix'
  | 'America/Chicago'
  | 'America/Guatemala'
  | 'America/New_York'
  | 'America/Bogota'
  | 'America/Caracas'
  | 'America/Santiago'
  | 'America/Buenos_Aires'
  | 'America/Sao_Paulo'
  | 'Atlantic/South_Georgia'
  | 'Atlantic/Azores'
  | 'Atlantic/Cape_Verde'
  | 'Europe/London'
  | 'Europe/Berlin'
  | 'Africa/Lagos'
  | 'Europe/Athens'
  | 'Africa/Cairo'
  | 'Europe/Moscow'
  | 'Asia/Riyadh'
  | 'Asia/Dubai'
  | 'Asia/Baku'
  | 'Asia/Karachi'
  | 'Asia/Tashkent'
  | 'Asia/Calcutta'
  | 'Asia/Dhaka'
  | 'Asia/Almaty'
  | 'Asia/Jakarta'
  | 'Asia/Bangkok'
  | 'Asia/Shanghai'
  | 'Asia/Singapore'
  | 'Asia/Tokyo'
  | 'Asia/Seoul'
  | 'Australia/Brisbane'
  | 'Australia/Sydney'
  | 'Pacific/Guam'
  | 'Pacific/Noumea'
  | 'Pacific/Auckland'
  | 'Pacific/Fiji';

export interface Config {
  auth: {
    users: UserAuthOperations;
  };
  blocks: {};
  collections: {
    users: User;
    posts: Post;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsJoins: {};
  collectionsSelect: {
    users: UsersSelect<false> | UsersSelect<true>;
    posts: PostsSelect<false> | PostsSelect<true>;
    'payload-locked-documents': PayloadLockedDocumentsSelect<false> | PayloadLockedDocumentsSelect<true>;
    'payload-preferences': PayloadPreferencesSelect<false> | PayloadPreferencesSelect<true>;
    'payload-migrations': PayloadMigrationsSelect<false> | PayloadMigrationsSelect<true>;
  };
  db: {
    defaultIDType: string;
  };
  globals: {};
  globalsSelect: {};
  locale: 'en' | 'ar';
  user: User & {
    collection: 'users';
  };
  jobs: {
    tasks: unknown;
    workflows: unknown;
  };
}
export interface UserAuthOperations {
  forgotPassword: {
    email: string;
    password: string;
  };
  login: {
    email: string;
    password: string;
  };
  registerFirstUser: {
    email: string;
    password: string;
  };
  unlock: {
    email: string;
    password: string;
  };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users".
 */
export interface User {
  id: string;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password?: string | null;
}
/**
 * Description
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "posts".
 */
export interface Post {
  id: string;
  title?: string | null;
  description?: string | null;
  content?: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents".
 */
export interface PayloadLockedDocument {
  id: string;
  document?:
    | ({
        relationTo: 'users';
        value: string | User;
      } | null)
    | ({
        relationTo: 'posts';
        value: string | Post;
      } | null);
  globalSlug?: string | null;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences".
 */
export interface PayloadPreference {
  id: string;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations".
 */
export interface PayloadMigration {
  id: string;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users_select".
 */
export interface UsersSelect<T extends boolean = true> {
  updatedAt?: T;
  createdAt?: T;
  email?: T;
  resetPasswordToken?: T;
  resetPasswordExpiration?: T;
  salt?: T;
  hash?: T;
  loginAttempts?: T;
  lockUntil?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "posts_select".
 */
export interface PostsSelect<T extends boolean = true> {
  title?: T;
  description?: T;
  content?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents_select".
 */
export interface PayloadLockedDocumentsSelect<T extends boolean = true> {
  document?: T;
  globalSlug?: T;
  user?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences_select".
 */
export interface PayloadPreferencesSelect<T extends boolean = true> {
  user?: T;
  key?: T;
  value?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations_select".
 */
export interface PayloadMigrationsSelect<T extends boolean = true> {
  name?: T;
  batch?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "auth".
 */
export interface Auth {
  [k: string]: unknown;
}


declare module 'payload' {
  // @ts-ignore 
  export interface GeneratedTypes extends Config {}
}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.eslint.json]---
Location: payload-main/test/localization-rtl/tsconfig.eslint.json

```json
{
  // extend your base config to share compilerOptions, etc
  //"extends": "./tsconfig.json",
  "compilerOptions": {
    // ensure that nobody can accidentally use this config for a build
    "noEmit": true
  },
  "include": [
    // whatever paths you intend to lint
    "./**/*.ts",
    "./**/*.tsx"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/test/localization-rtl/tsconfig.json

```json
{
  "extends": "../tsconfig.json"
}
```

--------------------------------------------------------------------------------

---[FILE: posts.ts]---
Location: payload-main/test/localization-rtl/collections/posts.ts

```typescript
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: {
      en: 'Post',
      ar: 'منشور',
    },
    plural: {
      en: 'Posts',
      ar: 'منشورات',
    },
  },
  admin: {
    description: { en: 'Description', ar: 'وصف' },
    listSearchableFields: ['title', 'description'],
    useAsTitle: 'title',
    defaultColumns: ['id', 'title', 'description'],
  },
  fields: [
    {
      name: 'title',
      label: {
        en: 'Title',
        ar: 'عنوان',
      },
      type: 'text',
      admin: {
        rtl: false,
      },
    },
    {
      name: 'description',
      type: 'text',
      localized: true,
      admin: {
        rtl: true,
      },
    },
    {
      name: 'content',
      type: 'richText',
      localized: true,
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: users.ts]---
Location: payload-main/test/localization-rtl/collections/users.ts

```typescript
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  fields: [],
}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/test/locked-documents/.gitignore

```text
/media
/media-gif
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: payload-main/test/locked-documents/config.ts

```typescript
import { fileURLToPath } from 'node:url'
import path from 'path'

import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { PagesCollection } from './collections/Pages/index.js'
import { PostsCollection } from './collections/Posts/index.js'
import { ServerComponentsCollection } from './collections/ServerComponents/index.js'
import { TestsCollection } from './collections/Tests/index.js'
import { Users } from './collections/Users/index.js'
import { AdminGlobal } from './globals/Admin/index.js'
import { MenuGlobal } from './globals/Menu/index.js'
import { seed } from './seed.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfigWithDefaults({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    PagesCollection,
    PostsCollection,
    ServerComponentsCollection,
    TestsCollection,
    Users,
  ],
  globals: [AdminGlobal, MenuGlobal],
  onInit: async (payload) => {
    if (process.env.SEED_IN_CONFIG_ONINIT !== 'false') {
      await seed(payload)
    }
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
```

--------------------------------------------------------------------------------

````
