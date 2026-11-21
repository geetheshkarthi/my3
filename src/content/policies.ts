/**
 * Legal / policy pages (source: "my3 policy pages.pdf").
 * `content` markup: text before the first "## " is the intro; sections start with "## Heading";
 * blank lines separate paragraphs; lines starting with "• " are bullet items.
 */
export type Policy = { slug: string; title: string; short: string; effective: string; summary: string; content: string };

const CONTACT = `Business Name: My3 Digital
Email: support@my3digital.com
Phone: 7780196804
Website: https://my3digital.com/`;

export const policies: Policy[] = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    short: "Privacy Policy",
    effective: "12 November 2026",
    summary: "How My3 Digital collects, uses, stores and protects your personal information.",
    content: `My3 Digital ("we", "our", "us") operates the website https://my3digital.com/. We respect your privacy and are committed to protecting the personal information you share with us.

This Privacy Policy explains how we collect, use, store and protect your information when you visit our website, contact us or purchase our services.

## 1. Information We Collect
We may collect the following information:

• Full name
• Email address
• Phone number
• Company or business name
• Billing information
• Business requirements and project details
• Information submitted through enquiry forms
• Payment transaction references and payment status
• Website usage information, including IP address, browser type and pages visited

We do not intentionally collect sensitive payment credentials such as card PINs, UPI PINs, passwords or complete banking credentials.

## 2. How We Use Your Information
The information collected may be used to:

• Respond to enquiries and consultation requests.
• Understand your business requirements.
• Prepare proposals, quotations and agreements.
• Provide website development, digital marketing, branding and other services.
• Process and verify payments.
• Generate invoices and maintain transaction records.
• Communicate project updates, deliverables and service-related information.
• Improve our website, services and customer experience.
• Send promotional communication where permitted by applicable law.
• Comply with legal, regulatory and accounting requirements.

## 3. Payment Information
Payments made through our website may be processed by third-party payment service providers, including Razorpay.

When you make a payment, the payment provider may collect and process relevant payment information in accordance with its own privacy policy and security practices.

My3 Digital does not store your complete card details, UPI PIN, internet banking password or other confidential banking credentials on its website servers.

## 4. Sharing of Information
We do not sell or rent your personal information to third parties.

However, information may be shared with:

• Payment gateway providers for processing transactions.
• Technology and hosting providers for website operations.
• Service providers assisting us in delivering contracted services.
• Professional advisers, auditors or legal representatives where necessary.
• Government authorities or regulatory bodies when legally required.

Such sharing will be limited to what is reasonably necessary for the relevant purpose or legal obligation.

## 5. Cookies and Website Analytics
Our website may use cookies and similar technologies to improve functionality, understand visitor behaviour and analyse website performance.

You may manage or disable cookies through your browser settings. Certain website features may not function properly if cookies are disabled.

## 6. Data Security
We take reasonable technical and organisational measures to protect personal information against unauthorised access, alteration, disclosure or destruction.

However, no internet-based transmission or electronic storage method can be guaranteed to be completely secure.

## 7. Data Retention
We retain personal information only for as long as reasonably necessary to fulfil the purposes described in this policy, provide our services, resolve disputes and comply with applicable legal and accounting obligations.

## 8. Your Rights
Subject to applicable law, you may request access to, correction of or deletion of your personal information.

You may also request that we stop sending promotional communication.

To submit a request, contact us using the details provided below.

## 9. Third-Party Websites
Our website may contain links to third-party websites, platforms or services. We are not responsible for their privacy practices or content. We encourage users to review their respective privacy policies.

## 10. Changes to This Privacy Policy
We may update this Privacy Policy from time to time. Any changes will be published on this page with the revised effective date.

## 11. Contact Information
For questions or requests relating to this Privacy Policy, contact:

${CONTACT}`,
  },
  {
    slug: "terms-and-conditions",
    title: "Terms & Conditions",
    short: "Terms & Conditions",
    effective: "12 November 2026",
    summary: "The terms that apply when you use our website, submit an enquiry or purchase our services.",
    content: `Welcome to My3 Digital. By accessing our website, submitting an enquiry, purchasing our services or making a payment, you agree to the following Terms & Conditions.

Please read these terms carefully before engaging our services.

## 1. About My3 Digital
My3 Digital is a digital services agency providing professional services that may include:

• Website design and development.
• E-commerce website development.
• UI/UX design and website redesign.
• Custom website development.
• Search engine optimisation (SEO).
• Google Ads, Meta Ads and other performance marketing services.
• Social media marketing and management.
• Branding, logo design and creative services.
• Content creation and video production.
• Website integrations, automation and related technology solutions.

The exact services offered to a client will be defined in the relevant proposal, quotation, invoice or project agreement.

## 2. Enquiries and Service Engagement
Submitting an enquiry through our website does not automatically establish a client relationship.

A project or service engagement will be considered confirmed once the relevant proposal or agreement has been accepted and the applicable initial payment has been received, unless otherwise agreed in writing.

## 3. Pricing and Quotations
• All service prices will be communicated through proposals, quotations or invoices.
• Prices may vary depending on project requirements, complexity, scope and additional features.
• Quotations are valid for the period specified in the quotation.
• Any work outside the agreed scope may be quoted and charged separately.
• Applicable taxes, including GST where applicable, will be charged as per prevailing laws.

## 4. Payments
Payments must be made according to the payment schedule mentioned in the relevant proposal, invoice or agreement.

We may accept payments through supported payment methods, including online payment gateways, bank transfers and other approved methods.

Project commencement, milestone progression and final delivery may depend on the receipt of applicable payments.

## 5. Project Scope and Revisions
The services, deliverables, timelines and revision allowances will be defined in the respective project agreement or proposal.

Any additional requirements, functionality, design changes or deliverables beyond the agreed scope may involve additional charges and revised timelines.

## 6. Client Responsibilities
Clients are responsible for:

• Providing accurate business information and project requirements.
• Supplying necessary content, images, logos and other materials.
• Providing timely feedback and approvals.
• Ensuring that supplied materials do not infringe third-party rights.
• Making payments according to the agreed schedule.
• Providing necessary access to relevant platforms, accounts or systems.

Delays in providing information, approvals or materials may affect project timelines.

## 7. Project Timelines
Project timelines will be communicated during onboarding or in the project agreement.

Timelines are dependent on project complexity, client feedback, content availability, approvals and third-party dependencies.

My3 Digital will make reasonable efforts to complete the agreed deliverables within the communicated timelines.

## 8. Intellectual Property
Ownership and usage rights for final deliverables will be governed by the relevant project agreement and applicable payment terms.

Unless otherwise agreed:

• Final approved custom deliverables will be transferred to the client after receipt of the agreed full payment.
• Third-party software, plugins, themes, stock assets and licensed materials remain subject to their respective licence terms.
• My3 Digital retains ownership of its pre-existing tools, frameworks, internal processes and reusable materials.
• Unpaid drafts, concepts and preliminary designs may not be used or distributed without written permission.

## 9. Third-Party Services
Some projects may involve third-party services such as hosting providers, domain registrars, payment gateways, software subscriptions, plugins, APIs and advertising platforms.

These services may have separate costs, terms, limitations and renewal requirements.

My3 Digital is not responsible for interruptions, policy changes, pricing changes or failures caused by third-party providers beyond our reasonable control.

## 10. Digital Marketing and Performance Disclaimer
Digital marketing outcomes depend on several factors, including competition, market demand, advertising budgets, audience behaviour, platform algorithms, website performance and client-side operations.

Unless expressly guaranteed in a written agreement, My3 Digital does not guarantee specific rankings, traffic volumes, leads, sales, revenue or advertising returns.

We will perform the services and activities agreed upon in the applicable proposal or agreement.

## 11. Confidentiality
Both parties agree to take reasonable steps to protect confidential business, financial, technical and project-related information shared during the engagement.

Confidential information will not be disclosed to unauthorised parties except where required by law or necessary for the agreed service delivery.

## 12. Limitation of Liability
To the extent permitted by applicable law, My3 Digital will not be liable for indirect, incidental, special or consequential losses arising from the use of our website or services.

Our liability for a particular engagement will be subject to the applicable project agreement and applicable law.

Nothing in these terms excludes liability that cannot legally be excluded.

## 13. Termination
Either party may terminate a service engagement in accordance with the termination provisions of the applicable project agreement.

Outstanding payments for services already delivered, approved milestones and authorised expenses will remain payable, subject to the relevant agreement and applicable law.

Refunds, where applicable, will be handled according to our Refund & Cancellation Policy.

## 14. Website Usage
You agree not to:

• Use our website for unlawful activities.
• Attempt unauthorised access to our systems.
• Distribute malicious software or harmful content.
• Copy or misuse website content, branding or intellectual property without permission.
• Submit false, misleading or fraudulent information.

## 15. Governing Law and Jurisdiction
These Terms & Conditions will be governed by the laws of India.

Disputes arising from these terms will be subject to the jurisdiction of competent courts in India.

## 16. Changes to These Terms
My3 Digital reserves the right to update these Terms & Conditions from time to time. Updated terms will be published on this page.

## 17. Contact Information
${CONTACT}`,
  },
  {
    slug: "refund-and-cancellation-policy",
    title: "Refund & Cancellation Policy",
    short: "Refund & Cancellation",
    effective: "12 November 2026",
    summary: "How cancellations and refunds are handled for our digital services.",
    content: `At My3 Digital, we provide customised digital services based on individual business requirements. Since our services involve professional time, planning, research, design, development and execution, our Refund & Cancellation Policy is structured according to the nature and stage of the service.

Please review this policy before making a payment.

## 1. General Refund Policy
Payments made towards our services are subject to the terms of the accepted proposal, quotation, invoice or project agreement.

Refund eligibility depends on the nature of the payment, work completed, project stage and any applicable written commitments.

A payment does not automatically become non-refundable merely because it has been made. Eligible refunds will be assessed in accordance with the agreed terms and applicable law.

## 2. Booking and Advance Payments
Some projects require an initial booking amount or advance payment to confirm the engagement and begin work.

The treatment of the booking amount will be specified in the relevant proposal or agreement.

Where a written agreement expressly provides for a refundable booking amount under specified conditions, the refund will be processed according to those conditions.

## 3. Cancellation Before Project Commencement
If a client requests cancellation before work has commenced, the refund will be assessed based on:

• The agreed cancellation terms.
• Any work already performed.
• Any third-party expenses or commitments authorised by the client.
• Any specific refundable or non-refundable amounts mentioned in the agreement.

Where a refund is due, the eligible amount will be processed after the cancellation request has been reviewed.

## 4. Cancellation After Project Commencement
If a client requests cancellation after the project has started:

• Charges for work already completed may be deducted where permitted by the agreement.
• Approved milestones and completed deliverables may remain payable.
• Third-party costs already incurred may be deducted where authorised and applicable.
• Any remaining eligible amount will be assessed for refund.

The calculation will be based on the agreed scope, work completed and applicable contractual terms.

## 5. Refunds for Digital Services
Refund requests relating to website development, e-commerce development, branding, digital marketing, SEO, social media management, creative services and other digital services will be reviewed individually.

Refunds are not automatically available simply because a client changes their mind, does not use a completed deliverable or does not achieve a particular business result that was not expressly guaranteed in writing.

However, any refund entitlement under the accepted agreement or applicable law will be honoured.

## 6. Refunds Due to Non-Delivery
If My3 Digital is unable to deliver a paid service or agreed deliverable for reasons attributable to us, we will communicate with the client and work towards an appropriate resolution.

Depending on the circumstances and applicable agreement, this may include:

• Completing the outstanding work.
• Agreeing on a revised delivery schedule.
• Providing an alternative agreed solution.
• Issuing a refund for the eligible undelivered portion.

## 7. Duplicate or Incorrect Payments
If a customer accidentally makes a duplicate payment or pays an incorrect amount, they should contact us with the relevant transaction details.

After verification, any eligible excess or duplicate payment will be refunded.

## 8. Refund Request Process
To request a cancellation or refund, customers must email us with:

• Full name.
• Registered email address.
• Phone number.
• Invoice or order reference.
• Payment transaction ID.
• Reason for requesting the refund.

Refund Request Email: support@my3digital.com

Our team will review the request and communicate the decision and any applicable next steps.

## 9. Refund Processing Time
Once a refund is approved, we will initiate it to the original payment method wherever supported.

The time taken for the amount to reflect in the customer's account may depend on the payment gateway, issuing bank or payment service provider.

We will share relevant refund confirmation or reference details where available.

## 10. Cancellation of Recurring Services
For recurring services such as monthly digital marketing, SEO or social media management, cancellation and notice requirements will be governed by the relevant service agreement.

Any services already delivered, approved expenses and outstanding amounts will be settled according to the agreement.

## 11. Contact Information
${CONTACT}`,
  },
  {
    slug: "shipping-and-delivery-policy",
    title: "Shipping & Delivery Policy",
    short: "Shipping & Delivery",
    effective: "12 November 2026",
    summary: "How our digital services and deliverables are provided to customers.",
    content: `My3 Digital provides professional digital services. We do not generally sell or ship physical products through our website.

This policy explains how our services and digital deliverables are provided to customers.

## 1. Nature of Our Services
Our services may include:

• Website design and development.
• E-commerce website development.
• UI/UX design.
• Branding and logo design.
• Search engine optimisation.
• Digital marketing and advertising management.
• Social media management.
• Content creation and creative services.
• Website integrations and automation.
• Other digital services agreed upon in writing.

All services are delivered digitally or through agreed professional communication channels.

## 2. Service Delivery Method
Depending on the nature of the project, deliverables may be shared through:

• Email.
• Online project management platforms.
• Cloud storage and file-sharing links.
• Website staging or development links.
• Client-owned hosting or domain accounts.
• Online meetings and project presentations.
• Other mutually agreed digital communication channels.

## 3. Delivery Timeline
The estimated delivery timeline will be communicated in the relevant proposal, quotation or project agreement.

Delivery timelines may vary depending on:

• Project scope and complexity.
• Availability of required content and resources.
• Client feedback and approval timelines.
• Third-party integrations.
• Technical requirements.
• Changes requested during the project.

## 4. Website Development Delivery
For website development projects, delivery may include the agreed website design, development, responsive implementation, integrations, testing and deployment.

The final website will be handed over according to the scope and payment terms specified in the relevant agreement.

Where included in the project scope, handover may also involve administrative access, source files, documentation and relevant credentials.

## 5. Digital Marketing Service Delivery
For digital marketing engagements, services will be delivered according to the agreed monthly or project-based scope.

Deliverables may include campaign setup, optimisation, content planning, reports, creative assets and performance updates, depending on the selected service.

## 6. Client Responsibilities
Clients must provide the required content, information, approvals, access credentials and other materials necessary for service delivery.

Delays in receiving these items may result in revised delivery timelines.

## 7. Delivery Confirmation
A service or deliverable may be considered delivered when it is shared, presented, made accessible or deployed according to the agreed scope.

Any review, acceptance or revision period specified in the project agreement will continue to apply.

## 8. Physical Shipping
As our services are primarily digital, physical shipping charges and physical product delivery timelines are generally not applicable.

If a particular project includes physical materials, printed items or other physical deliverables, the relevant delivery arrangements will be communicated separately.

## 9. Contact Information
For delivery-related queries:

${CONTACT}`,
  },
  {
    slug: "payment-policy",
    title: "Payment Policy",
    short: "Payment Policy",
    effective: "12 November 2026",
    summary: "Payment methods, schedules, invoices and security for services provided by My3 Digital.",
    content: `This Payment Policy explains the payment terms and procedures applicable to services provided by My3 Digital.

By purchasing our services or making a payment through our website, you agree to the relevant payment terms communicated in your proposal, invoice or project agreement.

## 1. Accepted Payment Methods
We may accept payments through supported payment methods, including:

• UPI.
• Debit cards.
• Credit cards.
• Net banking.
• Other payment methods made available through our authorised payment gateway.
• Bank transfers, where agreed.

Online payments may be processed through Razorpay or another authorised payment service provider.

Available payment methods may vary depending on the payment provider.

## 2. Pricing and Taxes
All service prices will be communicated through the applicable quotation, proposal or invoice.

Applicable GST and other statutory taxes will be charged as required under Indian law.

The final payable amount will be displayed or communicated before payment.

## 3. Payment Schedules
Depending on the nature of the project, payments may be structured as:

• Advance or booking payment.
• Milestone-based payments.
• Monthly service payments.
• Final payment upon completion or before handover.

The exact payment schedule will be mentioned in the relevant proposal, quotation, invoice or agreement.

## 4. Payment Confirmation
A payment will be considered received once it is successfully confirmed by the payment gateway or our bank.

Customers are advised to retain their payment confirmation, receipt or transaction reference for future communication.

An initiated, pending or failed transaction does not automatically constitute a successful payment.

## 5. Failed or Pending Transactions
If an amount is debited from your bank account but the payment status remains unsuccessful or pending, please contact us with the transaction reference.

We will verify the transaction with the payment provider and assist with the appropriate resolution.

If a payment has failed but the amount was debited, the reversal timeline may depend on the bank or payment service provider.

## 6. Duplicate Payments
If you accidentally make multiple payments for the same invoice or service, contact our support team with the transaction references.

After verification, eligible duplicate or excess payments will be refunded according to our Refund & Cancellation Policy.

## 7. Invoices and Receipts
Invoices or payment receipts will be issued as applicable.

Customers should provide accurate billing information, including business name, billing address and GSTIN where relevant, before invoice generation.

Any required corrections should be communicated promptly.

## 8. Recurring and Monthly Payments
For monthly or recurring services, payment frequency, due dates and applicable charges will be communicated in the relevant service agreement.

Customers are responsible for making payments within the agreed period.

## 9. Additional Charges
Any additional work, third-party subscription, domain registration, hosting, premium plugin, advertising spend, paid tool or other expense not included in the original quotation may be charged separately after communication and approval, where applicable.

## 10. Payment Security
Payments made through our website are processed using authorised payment service providers.

My3 Digital does not request or store customers' confidential banking passwords, card PINs or UPI PINs.

Customers should never share such credentials with anyone claiming to represent My3 Digital.

## 11. Contact Information
For payment-related queries:

${CONTACT}`,
  },
  {
    slug: "service-delivery-policy",
    title: "Service Delivery Policy",
    short: "Service Delivery",
    effective: "12 November 2026",
    summary: "Our general process for onboarding, executing, reviewing and delivering services to clients.",
    content: `My3 Digital provides customised digital solutions to businesses across different industries.

This Service Delivery Policy explains our general process for onboarding, executing, reviewing and delivering services to clients.

The exact scope, deliverables, timelines and payment terms for each engagement will be specified in the relevant proposal, quotation or project agreement.

## 1. Services Covered
This policy applies to services that may include:

• Website design and development.
• E-commerce website development.
• Custom web development.
• UI/UX design and redesign.
• Search engine optimisation.
• Performance marketing and paid advertising.
• Social media management.
• Branding and logo design.
• Creative design and content production.
• Digital integrations and automation.
• Other digital services agreed upon in writing.

## 2. Client Onboarding
After a project is confirmed, we initiate the onboarding process.

Depending on the service, onboarding may involve:

• Understanding the client's business objectives.
• Collecting project requirements.
• Reviewing references and competitor information.
• Collecting content and brand assets.
• Establishing project timelines.
• Confirming communication and approval procedures.
• Collecting required platform access.

## 3. Research and Planning
Depending on the scope, the project may begin with research, planning, competitor analysis, content structure, technical assessment or campaign strategy.

The activities included will depend on the selected service and the agreed project scope.

## 4. Design and Development
For website and branding projects, the process may involve:

• Information architecture.
• UI/UX design.
• Visual direction.
• Design presentations.
• Client feedback and approvals.
• Website development or creative execution.
• Functional testing.
• Responsive implementation.

Development or final production will proceed according to the agreed approval stages.

## 5. Digital Marketing Execution
For digital marketing services, execution may involve:

• Account and platform assessment.
• Audience and competitor research.
• Campaign planning.
• Content and creative development.
• Campaign setup.
• Monitoring and optimisation.
• Reporting and performance reviews.

The activities and reporting frequency will depend on the selected service package or agreement.

## 6. Timelines and Dependencies
Project timelines will be communicated before or during onboarding.

Delivery may depend on:

• Timely client approvals.
• Availability of content and assets.
• Access to required accounts and platforms.
• Third-party software or integrations.
• Changes in project scope.
• Technical dependencies.

If any dependency affects delivery, we will communicate the relevant updates.

## 7. Reviews and Revisions
Clients may review deliverables at the agreed stages.

The number of revisions, type of revisions and approval process will be specified in the project proposal or agreement.

Requests outside the agreed scope may require additional charges and revised delivery timelines.

## 8. Testing and Quality Checks
Where applicable, deliverables will undergo relevant quality checks before handover.

For website projects, these may include:

• Responsive layout checks.
• Navigation and functionality checks.
• Form and integration testing.
• Basic browser compatibility checks.
• Performance and usability checks.

The extent of testing will depend on the project scope.

## 9. Final Delivery and Handover
Once the agreed work is completed and applicable payment conditions are satisfied, final deliverables will be shared or deployed according to the project agreement.

Depending on the scope, handover may include:

• Website deployment.
• Administrative access.
• Agreed design and creative files.
• Relevant documentation.
• Agreed platform credentials or access transfer.
• Final project files and deliverables.

Third-party licences, subscriptions and platform ownership will remain subject to their respective terms.

## 10. Post-Delivery Support
Any post-delivery support, maintenance, warranty or technical assistance will be governed by the relevant proposal or agreement.

Ongoing maintenance or support is not automatically included unless specifically agreed.

## 11. Client Responsibilities
Clients are expected to:

• Provide accurate information and content.
• Supply necessary access and materials.
• Review deliverables within reasonable timelines.
• Provide consolidated feedback where possible.
• Make payments according to the agreed schedule.
• Obtain necessary rights and permissions for supplied content and assets.

## 12. Changes to Project Scope
Any request that materially changes the original project scope may require a revised quotation, additional payment or updated delivery schedule.

Such changes will be communicated before proceeding.

## 13. Contact Information
For service delivery and project-related queries:

${CONTACT}`,
  },
];
