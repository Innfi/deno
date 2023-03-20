import { ApiFactory } from 'https://deno.land/x/aws_api/client/mod.ts';
import { STS } from 'https://deno.land/x/aws_api/services/sts/mod.ts';
import { DynamoDB } from 'http://deno.land/x/aws_api/services/dynamodb/mod.ts';

const sts = new ApiFactory().makeNew(STS);

const identity = await sts.getCallerIdentity();

console.log(`user: ${identity.UserId}, account: ${identity.Account}, arn: ${identity.Arn}`);

const dynamo = new ApiFactory().makeNew(DynamoDB);

const createResult = await dynamo.createTable({ 
  TableName: 'innfisDynamo', 
  KeySchema: [
    { AttributeName: 'userId', KeyType: 'HASH' },
  ],
  AttributeDefinitions: [
    { AttributeName: 'userId', AttributeType: 'S' }
  ]
});

console.log(`createResult: ${JSON.stringify(createResult)}`);