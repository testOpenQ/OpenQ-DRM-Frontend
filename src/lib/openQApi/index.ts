export const GET_PRO_ACCOUNT_INFO_CURRENT = `query ($types: [String], $category: String) {
    currentUser {
      id
      watchedBountyIds
      github
      email
      company
      username
      city
      streetAddress
      country
      province
      discord
      github
      twitter

      postalCode
      billingName
      invoiceNumber
      invoicingEmail
      phoneNumber
      taxId
      vatNumber
      vatRate
      memo
   
      watchedBounties(limit: 100, types: $types, category: $category) {
        nodes {
          tvl
          tvc
          address
          bountyId
          watchingCount
        }
      }

      starredOrganizationIds
    }
  }
`;
export const UPSERT_USER = `
  mutation upsertUser{
    upsertUser {
      github
      email
      username
      id
    }
  }
`;
export const GET_CUSTOMER = `query getCustomers{
    customers(limit:100){
      nodes{
      id
      aliasEmail
      name
      email
      }
    }
  }`;
export const CREATE_CUSTOMER = `mutation createCustomer($email: Email, $name: String){
  createCustomer( email: $email, name: $name){
    id
    aliasEmail
    email
    name
    user{
      github
    }    
  }
  }`;
export const CREATE_EMAIL = `mutation createEmail($to: [String!]!, $from: String!, $subject: String!, $text: String!,
  $customerId: String!,
  $userId: String!,
  $sentByUser: Boolean,
    $html: String!){
      createEmailMessage(to:$to, from:$from, subject:$subject, text:$text, html:$html, customerId:$customerId, userId:$userId, sentByUser:$sentByUser){
      subject
      text
      from
      to
      html
      id
      userId
      }
    }
  `;
