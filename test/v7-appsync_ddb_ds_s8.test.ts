import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as V7AppsyncDdbDsS8 from '../lib/v7-appsync_ddb_ds_s8-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new V7AppsyncDdbDsS8.V7AppsyncDdbDsS8Stack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT));
});
