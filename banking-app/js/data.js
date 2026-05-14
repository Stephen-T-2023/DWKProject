/* ===== MOCK DATA ===== */
const Data = {
  users: [
    { id:'C001', name:'Sarah Mitchell', role:'customer', email:'sarah@email.com', faId:'FA001', initials:'SM', color:'#0066FF', phone:'+44 7700 900123' },
    { id:'C002', name:'James Thompson', role:'customer', email:'james@email.com', faId:'FA001', initials:'JT', color:'#8B5CF6', phone:'+44 7700 900456' },
    { id:'C003', name:'Emma Clarke', role:'customer', email:'emma@email.com', faId:'FA002', initials:'EC', color:'#22C55E', phone:'+44 7700 900789' },
    { id:'FA001', name:'David Chen', role:'fa', email:'david@dwk.com', tlId:'TL001', initials:'DC', color:'#F59E0B', phone:'+44 7700 900321', specialty:'Retail Banking', cases:12, closedCases:8, rating:4.8 },
    { id:'FA002', name:'Emily Williams', role:'fa', email:'emily@dwk.com', tlId:'TL001', initials:'EW', color:'#EF4444', phone:'+44 7700 900654', specialty:'Investments', cases:9, closedCases:7, rating:4.6 },
    { id:'FA003', name:'Marcus Johnson', role:'fa', email:'marcus@dwk.com', tlId:'TL001', initials:'MJ', color:'#3B82F6', phone:'+44 7700 900987', specialty:'Mortgages', cases:15, closedCases:11, rating:4.7 },
    { id:'TL001', name:'Robert Anderson', role:'teamleader', email:'robert@dwk.com', initials:'RA', color:'#0A2540', phone:'+44 7700 900111' },
  ],

  accounts: [
    { id:'ACC001', userId:'C001', type:'Current', balance:4523.87, iban:'GB29 NWBK 6016 1331 9268 19', color:'blue', frozen:false },
    { id:'ACC002', userId:'C001', type:'Savings ISA', balance:12350.00, iban:'GB29 NWBK 6016 1331 9268 20', color:'green', frozen:false },
    { id:'ACC003', userId:'C001', type:'Credit Card', balance:-842.55, iban:'GB29 NWBK 6016 1331 9268 21', color:'purple', frozen:false },
    { id:'ACC004', userId:'C002', type:'Current', balance:2341.55, iban:'GB29 NWBK 6016 1331 9268 22', color:'blue', frozen:false },
    { id:'ACC005', userId:'C002', type:'Savings ISA', balance:5800.00, iban:'GB29 NWBK 6016 1331 9268 23', color:'green', frozen:false },
  ],

  transactions: [
    { id:'T001', accountId:'ACC001', name:'Tesco Superstore', category:'Groceries', amount:-67.43, date:'2026-05-12', type:'debit', icon:'🛒', hidden:false },
    { id:'T002', accountId:'ACC001', name:'Salary — DWK', category:'Income', amount:3200.00, date:'2026-05-01', type:'credit', icon:'💼', hidden:false },
    { id:'T003', accountId:'ACC001', name:'Netflix', category:'Entertainment', amount:-15.99, date:'2026-05-10', type:'debit', icon:'🎬', hidden:true },
    { id:'T004', accountId:'ACC001', name:'Gym Membership', category:'Health', amount:-45.00, date:'2026-05-08', type:'debit', icon:'🏋️', hidden:false },
    { id:'T005', accountId:'ACC001', name:'Costa Coffee', category:'Dining', amount:-4.85, date:'2026-05-11', type:'debit', icon:'☕', hidden:false },
    { id:'T006', accountId:'ACC001', name:'Amazon', category:'Shopping', amount:-128.50, date:'2026-05-09', type:'debit', icon:'📦', hidden:true },
    { id:'T007', accountId:'ACC001', name:'British Gas', category:'Utilities', amount:-89.20, date:'2026-05-07', type:'debit', icon:'⚡', hidden:false },
    { id:'T008', accountId:'ACC001', name:'HSBC Transfer', category:'Transfer', amount:500.00, date:'2026-05-06', type:'credit', icon:'🏦', hidden:false },
    { id:'T009', accountId:'ACC001', name:'Uber', category:'Transport', amount:-14.30, date:'2026-05-11', type:'debit', icon:'🚗', hidden:false },
    { id:'T010', accountId:'ACC001', name:'Spotify', category:'Entertainment', amount:-9.99, date:'2026-05-10', type:'debit', icon:'🎵', hidden:false },
    { id:'T011', accountId:'ACC001', name:'Boots Pharmacy', category:'Health', amount:-23.40, date:'2026-05-05', type:'debit', icon:'💊', hidden:false },
    { id:'T012', accountId:'ACC001', name:'Council Tax — BCP', category:'Bills', amount:-164.00, date:'2026-05-03', type:'debit', icon:'🏛️', hidden:false },
    { id:'T013', accountId:'ACC001', name:'Night Out — Bournemouth', category:'Dining', amount:-89.00, date:'2026-05-03', type:'debit', icon:'🍻', hidden:true },
    { id:'T014', accountId:'ACC001', name:'Salary Bonus', category:'Income', amount:450.00, date:'2026-04-28', type:'credit', icon:'💰', hidden:false },
    { id:'T015', accountId:'ACC001', name:'NEXT Clothing', category:'Shopping', amount:-76.99, date:'2026-04-25', type:'debit', icon:'👕', hidden:false },
  ],

  budgets: [
    { id:'B001', userId:'C001', category:'Groceries', icon:'🛒', limit:300, spent:187, color:'#22C55E' },
    { id:'B002', userId:'C001', category:'Dining & Entertainment', icon:'🍽️', limit:150, spent:148, color:'#F59E0B' },
    { id:'B003', userId:'C001', category:'Transport', icon:'🚗', limit:100, spent:64, color:'#3B82F6' },
    { id:'B004', userId:'C001', category:'Shopping', icon:'🛍️', limit:200, spent:206, color:'#EF4444' },
    { id:'B005', userId:'C001', category:'Health & Fitness', icon:'🏋️', limit:80, spent:68, color:'#8B5CF6' },
    { id:'B006', userId:'C001', category:'Bills & Utilities', icon:'⚡', limit:350, spent:253, color:'#0066FF' },
  ],

  receipts: [
    { id:'R001', userId:'C001', name:'Tesco Receipt', merchant:'Tesco Superstore', amount:67.43, date:'2026-05-12', icon:'🛒', items:[{name:'Organic Milk 2L',price:1.85},{name:'Bread Wholemeal',price:1.20},{name:'Chicken Fillets 500g',price:4.99},{name:'Mixed Salad',price:2.00}] },
    { id:'R002', userId:'C001', name:'Amazon Invoice', merchant:'Amazon', amount:128.50, date:'2026-05-09', icon:'📦', items:[{name:'USB-C Hub',price:34.99},{name:'HDMI Cable',price:12.99},{name:'Notebook x3',price:8.99},{name:'Wireless Mouse',price:29.99}] },
    { id:'R003', userId:'C001', name:'Gym Direct Debit', merchant:'PureGym', amount:45.00, date:'2026-05-08', icon:'🏋️', items:[{name:'Monthly Membership',price:45.00}] },
    { id:'R004', userId:'FA001', name:'Client Dinner', merchant:'The Harbour Restaurant', amount:182.40, date:'2026-05-10', icon:'🍽️', items:[{name:'3-Course Meal x4',price:120.00},{name:'Wine',price:38.40},{name:'Service',price:24.00}] },
  ],

  messages: [
    { id:'M001', from:'C001', to:'FA001', text:'Hi David, can we review my pension plan next week?', time:'10:32', date:'2026-05-13', read:true },
    { id:'M002', from:'FA001', to:'C001', text:"Of course Sarah! I'll book us in for Tuesday at 2pm. I'll send across your updated projections beforehand.", time:'10:45', date:'2026-05-13', read:true },
    { id:'M003', from:'C001', to:'FA001', text:'Perfect, thank you. Also, I noticed an unusual transaction from yesterday?', time:'11:02', date:'2026-05-13', read:true },
    { id:'M004', from:'FA001', to:'C001', text:"I can see it — it's flagged as potentially uncommon. I've logged a review. I'll have a response by end of day.", time:'11:15', date:'2026-05-13', read:false },
    { id:'M005', from:'C002', to:'FA001', text:'Hello, could you send me my quarterly statement?', time:'09:20', date:'2026-05-12', read:true },
    { id:'M006', from:'FA001', to:'C002', text:"Hi James, I'll generate that now and send across a PDF. Should be with you within the hour.", time:'09:35', date:'2026-05-12', read:true },
    { id:'M007', from:'TL001', to:'FA001', text:'David, please see the new case assignment for this week.', time:'08:15', date:'2026-05-13', read:false },
    { id:'M008', from:'TL001', to:'FA002', text:'Emily, can you please action the outstanding complaint for client C003?', time:'14:00', date:'2026-05-13', read:true },
  ],

  cases: [
    { id:'CASE001', clientId:'C001', faId:'FA001', title:'Pension Review & Rebalance', status:'active', priority:'medium', difficulty:'medium', opened:'2026-04-15', deadline:'2026-05-30', progress:65, tags:['Pension','Investment'] },
    { id:'CASE002', clientId:'C002', faId:'FA001', title:'Mortgage Refinancing Assessment', status:'active', priority:'high', difficulty:'high', opened:'2026-04-20', deadline:'2026-05-20', progress:40, tags:['Mortgage','Refinancing'] },
    { id:'CASE003', clientId:'C003', faId:'FA002', title:'ISA Allowance Planning', status:'active', priority:'low', difficulty:'low', opened:'2026-05-01', deadline:'2026-06-01', progress:25, tags:['ISA','Tax'] },
    { id:'CASE004', clientId:'C001', faId:'FA001', title:'Annual Financial Review', status:'closed', priority:'medium', difficulty:'low', opened:'2026-03-01', deadline:'2026-04-01', progress:100, tags:['Review'] },
    { id:'CASE005', clientId:'C002', faId:'FA003', title:'Investment Portfolio Expansion', status:'active', priority:'high', difficulty:'high', opened:'2026-04-25', deadline:'2026-06-15', progress:20, tags:['Investment','Portfolio'] },
    { id:'CASE006', clientId:'C003', faId:'FA002', title:'Savings Strategy Review', status:'closed', priority:'low', difficulty:'low', opened:'2026-03-10', deadline:'2026-04-10', progress:100, tags:['Savings'] },
    { id:'CASE007', clientId:'C001', faId:'FA003', title:'Debt Consolidation Plan', status:'active', priority:'high', difficulty:'high', opened:'2026-05-05', deadline:'2026-05-25', progress:55, tags:['Debt','Credit'] },
  ],

  complaints: [
    { id:'CMP001', clientId:'C001', title:'Delayed transaction processing', desc:'Customer reports a 3-day delay in salary credit reflecting in account.', status:'open', severity:'medium', assignedFa:'FA001', date:'2026-05-10', resolution:null },
    { id:'CMP002', clientId:'C002', title:'Incorrect interest calculation', desc:'Savings ISA interest rate applied incorrectly for April statement.', status:'in-progress', severity:'high', assignedFa:'FA001', date:'2026-05-08', resolution:null },
    { id:'CMP003', clientId:'C003', title:'App login issue following 2FA update', desc:'Customer unable to complete biometric 2FA on iOS 18.4.', status:'resolved', severity:'low', assignedFa:'FA002', date:'2026-05-05', resolution:'Issue traced to iOS permission reset. Customer guided through re-enabling biometrics.' },
    { id:'CMP004', clientId:'C002', title:'Statement discrepancy — March', desc:'Two transactions appear twice on the March paper statement.', status:'open', severity:'medium', assignedFa:'FA003', date:'2026-05-12', resolution:null },
  ],

  reports: [
    { id:'REP001', faId:'FA001', clientId:'C001', title:'Q1 2026 Financial Summary', type:'quarterly', date:'2026-04-05', status:'final', preview:'Net worth increased by 8.2% over Q1. Savings rate maintained at 22%. Pension contributions on track for target retirement age of 62.' },
    { id:'REP002', faId:'FA001', clientId:'C002', title:'Mortgage Pre-Assessment', type:'assessment', date:'2026-05-02', status:'draft', preview:'Based on income verification and credit profile, client qualifies for up to £285,000 mortgage at 4.2% fixed rate over 25 years.' },
    { id:'REP003', faId:'FA002', clientId:'C003', title:'ISA Strategy Report', type:'planning', date:'2026-05-08', status:'final', preview:'Recommended split: 60% Stocks & Shares ISA, 40% Cash ISA. Projected growth of £2,100 over 12 months at current rates.' },
    { id:'REP004', faId:'FA001', clientId:'C001', title:'Annual Review 2025', type:'annual', date:'2026-01-15', status:'final', preview:'Full year performance review across all accounts. Overall financial health score: 82/100. Areas for improvement: emergency fund (+£2k target).' },
  ],

  news: [
    { id:'N001', category:'Markets', title:'FTSE 100 Hits New Record High Amid Rate Cut Optimism', preview:'The FTSE 100 index surged past 8,500 points today as investors grew increasingly confident that the Bank of England will begin cutting rates in June.', emoji:'📈', time:'2h ago', source:'DWK Market Watch' },
    { id:'N002', category:'Personal Finance', title:'New ISA Rules for 2026-27: What You Need to Know', preview:'The government has confirmed changes to ISA allowances and new "Flexible ISA" regulations coming into effect this April.', emoji:'💷', time:'5h ago', source:'Finance Insider' },
    { id:'N003', category:'Mortgages', title:'Average UK House Price Falls 1.2% — Is Now the Time to Buy?', preview:'Halifax reports a modest monthly decline, with experts split on whether this marks a sustained correction or a seasonal dip.', emoji:'🏠', time:'1d ago', source:'Property Weekly' },
    { id:'N004', category:'Technology', title:'Open Banking Adoption Hits 10 Million Users in the UK', preview:'The Financial Conduct Authority reports a milestone in open banking, with consumers increasingly using third-party apps for financial management.', emoji:'🔗', time:'2d ago', source:'FCA Insight' },
    { id:'N005', category:'Economy', title:'UK Inflation Drops to 2.1% — Lowest Since 2021', preview:'ONS data shows consumer price inflation easing closer to the 2% target, boosting household purchasing power and consumer confidence.', emoji:'📊', time:'3d ago', source:'ONS Bulletin' },
    { id:'N006', category:'Savings', title:'High-Street Banks Slash Savings Rates After Base Rate Speculation', preview:"Several major lenders have reduced easy-access savings rates this week. DWK's Savings ISA remains unchanged at 4.75% AER.", emoji:'🏦', time:'4d ago', source:'Money Saving Expert' },
  ],

  faqs: [
    { q:'How do I set up 2FA on my account?', a:'Go to Settings → Security & Login → Two-Factor Authentication. You can choose between biometric (fingerprint/face), email code, or SMS code. Biometric uses your device\'s built-in authentication, which is the most secure option.' },
    { q:'How can I freeze my account if I suspect fraud?', a:'You can instantly freeze any account from the Settings page or from the account card on your dashboard. When frozen, all transactions are blocked. You can unfreeze at any time. For fraud concerns, please also contact us immediately through in-app messaging or call 0800 123 4567.' },
    { q:'What is the Privacy View feature?', a:'Privacy View hides all your balance figures and transaction amounts across the app with a single toggle. This is useful when accessing your account in a public space. Click the eye icon in the top bar to toggle it on or off.' },
    { q:'How do itemised receipts work?', a:'You can upload photos or PDFs of receipts directly from the Receipts section. The app will extract the merchant, date, and total automatically. Linked receipts appear against matching transactions in your Statement.' },
    { q:'What are hidden transactions?', a:'You can mark any transaction as "hidden" so it does not appear in your default statement view. Hidden transactions still count toward your balance and budgets — they are simply hidden from the main list view for privacy. Toggle "Show Hidden" in your Statement to view them.' },
    { q:'How do I transfer my case to a different Financial Advisor?', a:'Contact your current FA through in-app messaging or speak to your branch. Team Leaders also have the ability to manually reassign cases. A transfer note will be added to your file and both your old and new FA will be notified.' },
    { q:'How do uncommon payment alerts work?', a:'Our system monitors your spending patterns and flags transactions that appear unusual — such as large amounts, new merchants, or overseas payments. You\'ll receive an in-app confirmation step to approve or dispute these payments in real time.' },
    { q:'Can I customise my dashboard?', a:'Yes! Go to Settings → Customisation to choose your preferred colour theme, rearrange your dashboard widgets, and set your default landing page.' },
  ],

  monthlyData: {
    labels: ['Nov','Dec','Jan','Feb','Mar','Apr','May'],
    income: [3200, 3650, 3200, 3200, 3400, 3200, 3650],
    expenses: [2100, 2800, 1950, 2250, 2050, 2180, 2100],
  },

  categorySpend: {
    labels: ['Groceries','Dining','Transport','Shopping','Health','Bills','Other'],
    data: [187, 148, 64, 206, 68, 253, 95],
  },

  teamStats: {
    totalClients: 3,
    activeCases: 5,
    closedThisMonth: 4,
    avgClosure: 14,
    caseRatio: { low: 2, medium: 2, high: 3 },
    closureRate: [68, 72, 75, 79, 82, 85, 88],
    months: ['Nov','Dec','Jan','Feb','Mar','Apr','May'],
  },
};
