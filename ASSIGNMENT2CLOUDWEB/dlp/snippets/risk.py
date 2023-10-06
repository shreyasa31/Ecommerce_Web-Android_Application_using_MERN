# Copyright 2023 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Sample app that uses the Data Loss Prevent API to perform risk anaylsis."""


import argparse


# [START dlp_numerical_stats]
import concurrent.futures

import google.cloud.dlp
import google.cloud.pubsub


def numerical_risk_analysis(
    project: str,
    table_project_id: str,
    dataset_id: str,
    table_id: str,
    column_name: str,
    topic_id: str,
    subscription_id: str,
    timeout: int = 300,
) -> None:
    """Uses the Data Loss Prevention API to compute risk metrics of a column
       of numerical data in a Google BigQuery table.
    Args:
        project: The Google Cloud project id to use as a parent resource.
        table_project_id: The Google Cloud project id where the BigQuery table
            is stored.
        dataset_id: The id of the dataset to inspect.
        table_id: The id of the table to inspect.
        column_name: The name of the column to compute risk metrics for.
        topic_id: The name of the Pub/Sub topic to notify once the job
            completes.
        subscription_id: The name of the Pub/Sub subscription to use when
            listening for job completion notifications.
        timeout: The number of seconds to wait for a response from the API.

    Returns:
        None; the response from the API is printed to the terminal.
    """

    # Instantiate a client.
    dlp = google.cloud.dlp_v2.DlpServiceClient()

    # Convert the project id into full resource ids.
    topic = google.cloud.pubsub.PublisherClient.topic_path(project, topic_id)
    parent = f"projects/{project}/locations/global"

    # Location info of the BigQuery table.
    source_table = {
        "project_id": table_project_id,
        "dataset_id": dataset_id,
        "table_id": table_id,
    }

    # Tell the API where to send a notification when the job is complete.
    actions = [{"pub_sub": {"topic": topic}}]

    # Configure risk analysis job
    # Give the name of the numeric column to compute risk metrics for
    risk_job = {
        "privacy_metric": {"numerical_stats_config": {"field": {"name": column_name}}},
        "source_table": source_table,
        "actions": actions,
    }

    # Call API to start risk analysis job
    operation = dlp.create_dlp_job(request={"parent": parent, "risk_job": risk_job})

    def callback(message: google.cloud.pubsub_v1.subscriber.message.Message) -> None:
        if message.attributes["DlpJobName"] == operation.name:
            # This is the message we're looking for, so acknowledge it.
            message.ack()

            # Now that the job is done, fetch the results and print them.
            job = dlp.get_dlp_job(request={"name": operation.name})
            print(f"Job name: {job.name}")
            results = job.risk_details.numerical_stats_result
            print(
                "Value Range: [{}, {}]".format(
                    results.min_value.integer_value,
                    results.max_value.integer_value,
                )
            )
            prev_value = None
            for percent, result in enumerate(results.quantile_values):
                value = result.integer_value
                if prev_value != value:
                    print(f"Value at {percent}% quantile: {value}")
                    prev_value = value
            subscription.set_result(None)
        else:
            # This is not the message we're looking for.
            message.drop()

    # Create a Pub/Sub client and find the subscription. The subscription is
    # expected to already be listening to the topic.
    subscriber = google.cloud.pubsub.SubscriberClient()
    subscription_path = subscriber.subscription_path(project, subscription_id)
    subscription = subscriber.subscribe(subscription_path, callback)

    try:
        subscription.result(timeout=timeout)
    except concurrent.futures.TimeoutError:
        print(
            "No event received before the timeout. Please verify that the "
            "subscription provided is subscribed to the topic provided."
        )
        subscription.close()


# [END dlp_numerical_stats]


# [START dlp_categorical_stats]

import concurrent.futures  # noqa: E402, F811, I100

import google.cloud.dlp  # noqa: E402, F811
import google.cloud.pubsub  # noqa: E402, F811


def categorical_risk_analysis(
    project: str,
    table_project_id: str,
    dataset_id: str,
    table_id: str,
    column_name: str,
    topic_id: str,
    subscription_id: str,
    timeout: int = 300,
) -> None:
    """Uses the Data Loss Prevention API to compute risk metrics of a column
       of categorical data in a Google BigQuery table.
    Args:
        project: The Google Cloud project id to use as a parent resource.
        table_project_id: The Google Cloud project id where the BigQuery table
            is stored.
        dataset_id: The id of the dataset to inspect.
        table_id: The id of the table to inspect.
        column_name: The name of the column to compute risk metrics for.
        topic_id: The name of the Pub/Sub topic to notify once the job
            completes.
        subscription_id: The name of the Pub/Sub subscription to use when
            listening for job completion notifications.
        timeout: The number of seconds to wait for a response from the API.

    Returns:
        None; the response from the API is printed to the terminal.
    """

    # Instantiate a client.
    dlp = google.cloud.dlp_v2.DlpServiceClient()

    # Convert the project id into full resource ids.
    topic = google.cloud.pubsub.PublisherClient.topic_path(project, topic_id)
    parent = f"projects/{project}/locations/global"

    # Location info of the BigQuery table.
    source_table = {
        "project_id": table_project_id,
        "dataset_id": dataset_id,
        "table_id": table_id,
    }

    # Tell the API where to send a notification when the job is complete.
    actions = [{"pub_sub": {"topic": topic}}]

    # Configure risk analysis job
    # Give the name of the numeric column to compute risk metrics for
    risk_job = {
        "privacy_metric": {
            "categorical_stats_config": {"field": {"name": column_name}}
        },
        "source_table": source_table,
        "actions": actions,
    }

    # Call API to start risk analysis job
    operation = dlp.create_dlp_job(request={"parent": parent, "risk_job": risk_job})

    def callback(message: google.cloud.pubsub_v1.subscriber.message.Message) -> None:
        if message.attributes["DlpJobName"] == operation.name:
            # This is the message we're looking for, so acknowledge it.
            message.ack()

            # Now that the job is done, fetch the results and print them.
            job = dlp.get_dlp_job(request={"name": operation.name})
            print(f"Job name: {job.name}")
            histogram_buckets = (
                job.risk_details.categorical_stats_result.value_frequency_histogram_buckets  # noqa: E501
            )
            # Print bucket stats
            for i, bucket in enumerate(histogram_buckets):
                print(f"Bucket {i}:")
                print(
                    "   Most common value occurs {} time(s)".format(
                        bucket.value_frequency_upper_bound
                    )
                )
                print(
                    "   Least common value occurs {} time(s)".format(
                        bucket.value_frequency_lower_bound
                    )
                )
                print(f"   {bucket.bucket_size} unique values total.")
                for value in bucket.bucket_values:
                    print(
                        "   Value {} occurs {} time(s)".format(
                            value.value.integer_value, value.count
                        )
                    )
            subscription.set_result(None)
        else:
            # This is not the message we're looking for.
            message.drop()

    # Create a Pub/Sub client and find the subscription. The subscription is
    # expected to already be listening to the topic.
    subscriber = google.cloud.pubsub.SubscriberClient()
    subscription_path = subscriber.subscription_path(project, subscription_id)
    subscription = subscriber.subscribe(subscription_path, callback)

    try:
        subscription.result(timeout=timeout)
    except concurrent.futures.TimeoutError:
        print(
            "No event received before the timeout. Please verify that the "
            "subscription provided is subscribed to the topic provided."
        )
        subscription.close()


# [END dlp_categorical_stats]


# [START dlp_k_anonymity]

import concurrent.futures  # noqa: I100, F811, E402

from typing import List  # noqa: E402, F811

import google.cloud.dlp  # noqa: I100, F811, E402
from google.cloud.dlp_v2 import types  # noqa: I100, F811, E402
import google.cloud.pubsub  # noqa: I100, F811, E402


def k_anonymity_analysis(
    project: str,
    table_project_id: str,
    dataset_id: str,
    table_id: str,
    topic_id: str,
    subscription_id: str,
    quasi_ids: List[str],
    timeout: int = 300,
) -> None:
    """Uses the Data Loss Prevention API to compute the k-anonymity of a
        column set in a Google BigQuery table.
    Args:
        project: The Google Cloud project id to use as a parent resource.
        table_project_id: The Google Cloud project id where the BigQuery table
            is stored.
        dataset_id: The id of the dataset to inspect.
        table_id: The id of the table to inspect.
        topic_id: The name of the Pub/Sub topic to notify once the job
            completes.
        subscription_id: The name of the Pub/Sub subscription to use when
            listening for job completion notifications.
        quasi_ids: A set of columns that form a composite key.
        timeout: The number of seconds to wait for a response from the API.

    Returns:
        None; the response from the API is printed to the terminal.
    """

    # Create helper function for unpacking values
    def get_values(obj: types.Value) -> int:
        return int(obj.integer_value)

    # Instantiate a client.
    dlp = google.cloud.dlp_v2.DlpServiceClient()

    # Convert the project id into a full resource id.
    topic = google.cloud.pubsub.PublisherClient.topic_path(project, topic_id)
    parent = f"projects/{project}/locations/global"

    # Location info of the BigQuery table.
    source_table = {
        "project_id": table_project_id,
        "dataset_id": dataset_id,
        "table_id": table_id,
    }

    # Convert quasi id list to Protobuf type
    def map_fields(field: str) -> dict:
        return {"name": field}

    quasi_ids = map(map_fields, quasi_ids)

    # Tell the API where to send a notification when the job is complete.
    actions = [{"pub_sub": {"topic": topic}}]

    # Configure risk analysis job
    # Give the name of the numeric column to compute risk metrics for
    risk_job = {
        "privacy_metric": {"k_anonymity_config": {"quasi_ids": quasi_ids}},
        "source_table": source_table,
        "actions": actions,
    }

    # Call API to start risk analysis job
    operation = dlp.create_dlp_job(request={"parent": parent, "risk_job": risk_job})

    def callback(message: google.cloud.pubsub_v1.subscriber.message.Message) -> None:
        if message.attributes["DlpJobName"] == operation.name:
            # This is the message we're looking for, so acknowledge it.
            message.ack()

            # Now that the job is done, fetch the results and print them.
            job = dlp.get_dlp_job(request={"name": operation.name})
            print(f"Job name: {job.name}")
            histogram_buckets = (
                job.risk_details.k_anonymity_result.equivalence_class_histogram_buckets
            )
            # Print bucket stats
            for i, bucket in enumerate(histogram_buckets):
                print(f"Bucket {i}:")
                if bucket.equivalence_class_size_lower_bound:
                    print(
                        "   Bucket size range: [{}, {}]".format(
                            bucket.equivalence_class_size_lower_bound,
                            bucket.equivalence_class_size_upper_bound,
                        )
                    )
                    for value_bucket in bucket.bucket_values:
                        print(
                            "   Quasi-ID values: {}".format(
                                map(get_values, value_bucket.quasi_ids_values)
                            )
                        )
                        print(
                            "   Class size: {}".format(
                                value_bucket.equivalence_class_size
                            )
                        )
            subscription.set_result(None)
        else:
            # This is not the message we're looking for.
            message.drop()

    # Create a Pub/Sub client and find the subscription. The subscription is
    # expected to already be listening to the topic.
    subscriber = google.cloud.pubsub.SubscriberClient()
    subscription_path = subscriber.subscription_path(project, subscription_id)
    subscription = subscriber.subscribe(subscription_path, callback)

    try:
        subscription.result(timeout=timeout)
    except concurrent.futures.TimeoutError:
        print(
            "No event received before the timeout. Please verify that the "
            "subscription provided is subscribed to the topic provided."
        )
        subscription.close()


# [END dlp_k_anonymity]


# [START dlp_k_anonymity_with_entity_id]
import time  # noqa: I100,  F811, E402
from typing import List  # noqa: E402, F811

import google.cloud.dlp_v2  # noqa: I100, F811, E402


def k_anonymity_with_entity_id(
    project: str,
    source_table_project_id: str,
    source_dataset_id: str,
    source_table_id: str,
    entity_id: str,
    quasi_ids: List[str],
    output_table_project_id: str,
    output_dataset_id: str,
    output_table_id: str,
) -> None:
    """Uses the Data Loss Prevention API to compute the k-anonymity using entity_id
        of a column set in a Google BigQuery table.
    Args:
        project: The Google Cloud project id to use as a parent resource.
        source_table_project_id: The Google Cloud project id where the BigQuery table
            is stored.
        source_dataset_id: The id of the dataset to inspect.
        source_table_id: The id of the table to inspect.
        entity_id: The column name of the table that enables accurately determining k-anonymity
         in the common scenario wherein several rows of dataset correspond to the same sensitive
         information.
        quasi_ids: A set of columns that form a composite key.
        output_table_project_id: The Google Cloud project id where the output BigQuery table
            is stored.
        output_dataset_id: The id of the output BigQuery dataset.
        output_table_id: The id of the output BigQuery table.
    """

    # Instantiate a client.
    dlp = google.cloud.dlp_v2.DlpServiceClient()

    # Location info of the source BigQuery table.
    source_table = {
        "project_id": source_table_project_id,
        "dataset_id": source_dataset_id,
        "table_id": source_table_id,
    }

    # Specify the bigquery table to store the findings.
    # The output_table_id in the given BigQuery dataset will be created if it doesn't
    # already exist.
    dest_table = {
        "project_id": output_table_project_id,
        "dataset_id": output_dataset_id,
        "table_id": output_table_id,
    }

    # Convert quasi id list to Protobuf type
    def map_fields(field: str) -> dict:
        return {"name": field}

    #  Configure column names of quasi-identifiers to analyze
    quasi_ids = map(map_fields, quasi_ids)

    # Tell the API where to send a notification when the job is complete.
    actions = [{"save_findings": {"output_config": {"table": dest_table}}}]

    # Configure the privacy metric to compute for re-identification risk analysis.
    # Specify the unique identifier in the source table for the k-anonymity analysis.
    privacy_metric = {
        "k_anonymity_config": {
            "entity_id": {"field": {"name": entity_id}},
            "quasi_ids": quasi_ids,
        }
    }

    # Configure risk analysis job.
    risk_job = {
        "privacy_metric": privacy_metric,
        "source_table": source_table,
        "actions": actions,
    }

    # Convert the project id into a full resource id.
    parent = f"projects/{project}/locations/global"

    # Call API to start risk analysis job.
    response = dlp.create_dlp_job(
        request={
            "parent": parent,
            "risk_job": risk_job,
        }
    )
    job_name = response.name
    print(f"Inspection Job started : {job_name}")

    # Waiting for a maximum of 15 minutes for the job to be completed.
    job = dlp.get_dlp_job(request={"name": job_name})
    no_of_attempts = 30
    while no_of_attempts > 0:
        # Check if the job has completed
        if job.state == google.cloud.dlp_v2.DlpJob.JobState.DONE:
            break
        if job.state == google.cloud.dlp_v2.DlpJob.JobState.FAILED:
            print("Job Failed, Please check the configuration.")
            return

        # Sleep for a short duration before checking the job status again
        time.sleep(30)
        no_of_attempts -= 1

        # Get the DLP job status
        job = dlp.get_dlp_job(request={"name": job_name})

    if job.state != google.cloud.dlp_v2.DlpJob.JobState.DONE:
        print("Job did not complete within 15 minutes.")
        return

    # Create helper function for unpacking values
    def get_values(obj: types.Value) -> str:
        return str(obj.string_value)

    # Print out the results.
    print(f"Job name: {job.name}")
    histogram_buckets = (
        job.risk_details.k_anonymity_result.equivalence_class_histogram_buckets
    )
    # Print bucket stats
    for i, bucket in enumerate(histogram_buckets):
        print(f"Bucket {i}:")
        if bucket.equivalence_class_size_lower_bound:
            print(
                f"Bucket size range: [{bucket.equivalence_class_size_lower_bound}, "
                f"{bucket.equivalence_class_size_upper_bound}]"
            )
            for value_bucket in bucket.bucket_values:
                print(
                    f"Quasi-ID values: {get_values(value_bucket.quasi_ids_values[0])}"
                )
                print(f"Class size: {value_bucket.equivalence_class_size}")
        else:
            print("No findings.")


# [END dlp_k_anonymity_with_entity_id]


# [START dlp_l_diversity]
from typing import List  # noqa: I100, F811, E402
import concurrent.futures  # noqa: I100, F811, E402

import google.cloud.dlp  # noqa: I100, F811, E402
from google.cloud.dlp_v2 import types  # noqa: I100, F811, E402
import google.cloud.pubsub  # noqa: I100, F811, E402


def l_diversity_analysis(
    project: str,
    table_project_id: str,
    dataset_id: str,
    table_id: str,
    topic_id: str,
    subscription_id: str,
    sensitive_attribute: str,
    quasi_ids: List[str],
    timeout: int = 300,
) -> None:
    """Uses the Data Loss Prevention API to compute the l-diversity of a
        column set in a Google BigQuery table.
    Args:
        project: The Google Cloud project id to use as a parent resource.
        table_project_id: The Google Cloud project id where the BigQuery table
            is stored.
        dataset_id: The id of the dataset to inspect.
        table_id: The id of the table to inspect.
        topic_id: The name of the Pub/Sub topic to notify once the job
            completes.
        subscription_id: The name of the Pub/Sub subscription to use when
            listening for job completion notifications.
        sensitive_attribute: The column to measure l-diversity relative to.
        quasi_ids: A set of columns that form a composite key.
        timeout: The number of seconds to wait for a response from the API.

    Returns:
        None; the response from the API is printed to the terminal.
    """

    # Create helper function for unpacking values
    def get_values(obj: types.Value) -> int:
        return int(obj.integer_value)

    # Instantiate a client.
    dlp = google.cloud.dlp_v2.DlpServiceClient()

    # Convert the project id into a full resource id.
    topic = google.cloud.pubsub.PublisherClient.topic_path(project, topic_id)
    parent = f"projects/{project}/locations/global"

    # Location info of the BigQuery table.
    source_table = {
        "project_id": table_project_id,
        "dataset_id": dataset_id,
        "table_id": table_id,
    }

    # Convert quasi id list to Protobuf type
    def map_fields(field: str) -> dict:
        return {"name": field}

    quasi_ids = map(map_fields, quasi_ids)

    # Tell the API where to send a notification when the job is complete.
    actions = [{"pub_sub": {"topic": topic}}]

    # Configure risk analysis job
    # Give the name of the numeric column to compute risk metrics for
    risk_job = {
        "privacy_metric": {
            "l_diversity_config": {
                "quasi_ids": quasi_ids,
                "sensitive_attribute": {"name": sensitive_attribute},
            }
        },
        "source_table": source_table,
        "actions": actions,
    }

    # Call API to start risk analysis job
    operation = dlp.create_dlp_job(request={"parent": parent, "risk_job": risk_job})

    def callback(message: google.cloud.pubsub_v1.subscriber.message.Message) -> None:
        if message.attributes["DlpJobName"] == operation.name:
            # This is the message we're looking for, so acknowledge it.
            message.ack()

            # Now that the job is done, fetch the results and print them.
            job = dlp.get_dlp_job(request={"name": operation.name})
            print(f"Job name: {job.name}")
            histogram_buckets = (
                job.risk_details.l_diversity_result.sensitive_value_frequency_histogram_buckets  # noqa: E501
            )
            # Print bucket stats
            for i, bucket in enumerate(histogram_buckets):
                print(f"Bucket {i}:")
                print(
                    "   Bucket size range: [{}, {}]".format(
                        bucket.sensitive_value_frequency_lower_bound,
                        bucket.sensitive_value_frequency_upper_bound,
                    )
                )
                for value_bucket in bucket.bucket_values:
                    print(
                        "   Quasi-ID values: {}".format(
                            map(get_values, value_bucket.quasi_ids_values)
                        )
                    )
                    print(f"   Class size: {value_bucket.equivalence_class_size}")
                    for value in value_bucket.top_sensitive_values:
                        print(
                            "   Sensitive value {} occurs {} time(s)".format(
                                value.value, value.count
                            )
                        )
            subscription.set_result(None)
        else:
            # This is not the message we're looking for.
            message.drop()

    # Create a Pub/Sub client and find the subscription. The subscription is
    # expected to already be listening to the topic.
    subscriber = google.cloud.pubsub.SubscriberClient()
    subscription_path = subscriber.subscription_path(project, subscription_id)
    subscription = subscriber.subscribe(subscription_path, callback)

    try:
        subscription.result(timeout=timeout)
    except concurrent.futures.TimeoutError:
        print(
            "No event received before the timeout. Please verify that the "
            "subscription provided is subscribed to the topic provided."
        )
        subscription.close()


# [END dlp_l_diversity]


# [START dlp_k_map]
from typing import List  # noqa: I100, E402
import concurrent.futures  # noqa: I100, F811, E402

import google.cloud.dlp  # noqa: I100, F811, E402
from google.cloud.dlp_v2 import types  # noqa: I100, F811, E402
import google.cloud.pubsub  # noqa: I100, F811, E402


def k_map_estimate_analysis(
    project: str,
    table_project_id: str,
    dataset_id: str,
    table_id: str,
    topic_id: str,
    subscription_id: str,
    quasi_ids: List[str],
    info_types: List[str],
    region_code: str = "US",
    timeout: int = 300,
) -> None:
    """Uses the Data Loss Prevention API to compute the k-map risk estimation
        of a column set in a Google BigQuery table.
    Args:
        project: The Google Cloud project id to use as a parent resource.
        table_project_id: The Google Cloud project id where the BigQuery table
            is stored.
        dataset_id: The id of the dataset to inspect.
        table_id: The id of the table to inspect.
        column_name: The name of the column to compute risk metrics for.
        topic_id: The name of the Pub/Sub topic to notify once the job
            completes.
        subscription_id: The name of the Pub/Sub subscription to use when
            listening for job completion notifications.
        quasi_ids: A set of columns that form a composite key and optionally
            their reidentification distributions.
        info_types: Type of information of the quasi_id in order to provide a
            statistical model of population.
        region_code: The ISO 3166-1 region code that the data is representative
            of. Can be omitted if using a region-specific infoType (such as
            US_ZIP_5)
        timeout: The number of seconds to wait for a response from the API.

    Returns:
        None; the response from the API is printed to the terminal.
    """

    # Create helper function for unpacking values
    def get_values(obj: types.Value) -> int:
        return int(obj.integer_value)

    # Instantiate a client.
    dlp = google.cloud.dlp_v2.DlpServiceClient()

    # Convert the project id into full resource ids.
    topic = google.cloud.pubsub.PublisherClient.topic_path(project, topic_id)
    parent = f"projects/{project}/locations/global"

    # Location info of the BigQuery table.
    source_table = {
        "project_id": table_project_id,
        "dataset_id": dataset_id,
        "table_id": table_id,
    }

    # Check that numbers of quasi-ids and info types are equal
    if len(quasi_ids) != len(info_types):
        raise ValueError(
            """Number of infoTypes and number of quasi-identifiers
                            must be equal!"""
        )

    # Convert quasi id list to Protobuf type
    def map_fields(quasi_id: str, info_type: str) -> dict:
        return {"field": {"name": quasi_id}, "info_type": {"name": info_type}}

    quasi_ids = map(map_fields, quasi_ids, info_types)

    # Tell the API where to send a notification when the job is complete.
    actions = [{"pub_sub": {"topic": topic}}]

    # Configure risk analysis job
    # Give the name of the numeric column to compute risk metrics for
    risk_job = {
        "privacy_metric": {
            "k_map_estimation_config": {
                "quasi_ids": quasi_ids,
                "region_code": region_code,
            }
        },
        "source_table": source_table,
        "actions": actions,
    }

    # Call API to start risk analysis job
    operation = dlp.create_dlp_job(request={"parent": parent, "risk_job": risk_job})

    def callback(message: google.cloud.pubsub_v1.subscriber.message.Message) -> None:
        if message.attributes["DlpJobName"] == operation.name:
            # This is the message we're looking for, so acknowledge it.
            message.ack()

            # Now that the job is done, fetch the results and print them.
            job = dlp.get_dlp_job(request={"name": operation.name})
            print(f"Job name: {job.name}")
            histogram_buckets = (
                job.risk_details.k_map_estimation_result.k_map_estimation_histogram
            )
            # Print bucket stats
            for i, bucket in enumerate(histogram_buckets):
                print(f"Bucket {i}:")
                print(
                    "   Anonymity range: [{}, {}]".format(
                        bucket.min_anonymity, bucket.max_anonymity
                    )
                )
                print(f"   Size: {bucket.bucket_size}")
                for value_bucket in bucket.bucket_values:
                    print(
                        "   Values: {}".format(
                            map(get_values, value_bucket.quasi_ids_values)
                        )
                    )
                    print(
                        "   Estimated k-map anonymity: {}".format(
                            value_bucket.estimated_anonymity
                        )
                    )
            subscription.set_result(None)
        else:
            # This is not the message we're looking for.
            message.drop()

    # Create a Pub/Sub client and find the subscription. The subscription is
    # expected to already be listening to the topic.
    subscriber = google.cloud.pubsub.SubscriberClient()
    subscription_path = subscriber.subscription_path(project, subscription_id)
    subscription = subscriber.subscribe(subscription_path, callback)

    try:
        subscription.result(timeout=timeout)
    except concurrent.futures.TimeoutError:
        print(
            "No event received before the timeout. Please verify that the "
            "subscription provided is subscribed to the topic provided."
        )
        subscription.close()


# [END dlp_k_map]


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    subparsers = parser.add_subparsers(
        dest="content", help="Select how to submit content to the API."
    )
    subparsers.required = True

    numerical_parser = subparsers.add_parser("numerical", help="")
    numerical_parser.add_argument(
        "project",
        help="The Google Cloud project id to use as a parent resource.",
    )
    numerical_parser.add_argument(
        "table_project_id",
        help="The Google Cloud project id where the BigQuery table is stored.",
    )
    numerical_parser.add_argument(
        "dataset_id", help="The id of the dataset to inspect."
    )
    numerical_parser.add_argument("table_id", help="The id of the table to inspect.")
    numerical_parser.add_argument(
        "column_name",
        help="The name of the column to compute risk metrics for.",
    )
    numerical_parser.add_argument(
        "topic_id",
        help="The name of the Pub/Sub topic to notify once the job completes.",
    )
    numerical_parser.add_argument(
        "subscription_id",
        help="The name of the Pub/Sub subscription to use when listening for"
        "job completion notifications.",
    )
    numerical_parser.add_argument(
        "--timeout",
        type=int,
        help="The number of seconds to wait for a response from the API.",
    )

    categorical_parser = subparsers.add_parser("categorical", help="")
    categorical_parser.add_argument(
        "project",
        help="The Google Cloud project id to use as a parent resource.",
    )
    categorical_parser.add_argument(
        "table_project_id",
        help="The Google Cloud project id where the BigQuery table is stored.",
    )
    categorical_parser.add_argument(
        "dataset_id", help="The id of the dataset to inspect."
    )
    categorical_parser.add_argument("table_id", help="The id of the table to inspect.")
    categorical_parser.add_argument(
        "column_name",
        help="The name of the column to compute risk metrics for.",
    )
    categorical_parser.add_argument(
        "topic_id",
        help="The name of the Pub/Sub topic to notify once the job completes.",
    )
    categorical_parser.add_argument(
        "subscription_id",
        help="The name of the Pub/Sub subscription to use when listening for"
        "job completion notifications.",
    )
    categorical_parser.add_argument(
        "--timeout",
        type=int,
        help="The number of seconds to wait for a response from the API.",
    )

    k_anonymity_parser = subparsers.add_parser(
        "k_anonymity",
        help="Computes the k-anonymity of a column set in a Google BigQuery" "table.",
    )
    k_anonymity_parser.add_argument(
        "project",
        help="The Google Cloud project id to use as a parent resource.",
    )
    k_anonymity_parser.add_argument(
        "table_project_id",
        help="The Google Cloud project id where the BigQuery table is stored.",
    )
    k_anonymity_parser.add_argument(
        "dataset_id", help="The id of the dataset to inspect."
    )
    k_anonymity_parser.add_argument("table_id", help="The id of the table to inspect.")
    k_anonymity_parser.add_argument(
        "topic_id",
        help="The name of the Pub/Sub topic to notify once the job completes.",
    )
    k_anonymity_parser.add_argument(
        "subscription_id",
        help="The name of the Pub/Sub subscription to use when listening for"
        "job completion notifications.",
    )
    k_anonymity_parser.add_argument(
        "quasi_ids",
        nargs="+",
        help="A set of columns that form a composite key.",
    )
    k_anonymity_parser.add_argument(
        "--timeout",
        type=int,
        help="The number of seconds to wait for a response from the API.",
    )

    k_anonymity_entity_parser = subparsers.add_parser(
        "k_anonymity_w_entity",
        help="Computes the k-anonymity of a column set in a Google BigQuery table.",
    )
    k_anonymity_entity_parser.add_argument(
        "project",
        help="The Google Cloud project id to use as a parent resource.",
    )
    k_anonymity_entity_parser.add_argument(
        "source_table_project_id",
        help="The Google Cloud project id where the BigQuery table is stored.",
    )
    k_anonymity_entity_parser.add_argument(
        "source_dataset_id",
        help="The id of the dataset to inspect.",
    )
    k_anonymity_entity_parser.add_argument(
        "source_table_id",
        help="The id of the table to inspect.",
    )
    k_anonymity_entity_parser.add_argument(
        "entity_id",
        help="The column name of the table that enables accurately "
        "determining k-anonymity",
    )
    k_anonymity_entity_parser.add_argument(
        "quasi_ids",
        nargs="+",
        help="A set of columns that form a composite key.",
    )
    k_anonymity_entity_parser.add_argument(
        "output_table_project_id",
        help="The Google Cloud project id where the output BigQuery table "
        "would be stored.",
    )
    k_anonymity_entity_parser.add_argument(
        "output_dataset_id",
        help="The id of the output BigQuery dataset.",
    )
    k_anonymity_entity_parser.add_argument(
        "output_table_id",
        help="The id of the output BigQuery table.",
    )

    l_diversity_parser = subparsers.add_parser(
        "l_diversity",
        help="Computes the l-diversity of a column set in a Google BigQuery" "table.",
    )
    l_diversity_parser.add_argument(
        "project",
        help="The Google Cloud project id to use as a parent resource.",
    )
    l_diversity_parser.add_argument(
        "table_project_id",
        help="The Google Cloud project id where the BigQuery table is stored.",
    )
    l_diversity_parser.add_argument(
        "dataset_id", help="The id of the dataset to inspect."
    )
    l_diversity_parser.add_argument("table_id", help="The id of the table to inspect.")
    l_diversity_parser.add_argument(
        "topic_id",
        help="The name of the Pub/Sub topic to notify once the job completes.",
    )
    l_diversity_parser.add_argument(
        "subscription_id",
        help="The name of the Pub/Sub subscription to use when listening for"
        "job completion notifications.",
    )
    l_diversity_parser.add_argument(
        "sensitive_attribute",
        help="The column to measure l-diversity relative to.",
    )
    l_diversity_parser.add_argument(
        "quasi_ids",
        nargs="+",
        help="A set of columns that form a composite key.",
    )
    l_diversity_parser.add_argument(
        "--timeout",
        type=int,
        help="The number of seconds to wait for a response from the API.",
    )

    k_map_parser = subparsers.add_parser(
        "k_map",
        help="Computes the k-map risk estimation of a column set in a Google"
        "BigQuery table.",
    )
    k_map_parser.add_argument(
        "project",
        help="The Google Cloud project id to use as a parent resource.",
    )
    k_map_parser.add_argument(
        "table_project_id",
        help="The Google Cloud project id where the BigQuery table is stored.",
    )
    k_map_parser.add_argument("dataset_id", help="The id of the dataset to inspect.")
    k_map_parser.add_argument("table_id", help="The id of the table to inspect.")
    k_map_parser.add_argument(
        "topic_id",
        help="The name of the Pub/Sub topic to notify once the job completes.",
    )
    k_map_parser.add_argument(
        "subscription_id",
        help="The name of the Pub/Sub subscription to use when listening for"
        "job completion notifications.",
    )
    k_map_parser.add_argument(
        "quasi_ids",
        nargs="+",
        help="A set of columns that form a composite key.",
    )
    k_map_parser.add_argument(
        "-t",
        "--info-types",
        nargs="+",
        help="Type of information of the quasi_id in order to provide a"
        "statistical model of population.",
        required=True,
    )
    k_map_parser.add_argument(
        "-r",
        "--region-code",
        default="US",
        help="The ISO 3166-1 region code that the data is representative of.",
    )
    k_map_parser.add_argument(
        "--timeout",
        type=int,
        help="The number of seconds to wait for a response from the API.",
    )

    args = parser.parse_args()

    if args.content == "numerical":
        numerical_risk_analysis(
            args.project,
            args.table_project_id,
            args.dataset_id,
            args.table_id,
            args.column_name,
            args.topic_id,
            args.subscription_id,
            timeout=args.timeout,
        )
    elif args.content == "categorical":
        categorical_risk_analysis(
            args.project,
            args.table_project_id,
            args.dataset_id,
            args.table_id,
            args.column_name,
            args.topic_id,
            args.subscription_id,
            timeout=args.timeout,
        )
    elif args.content == "k_anonymity":
        k_anonymity_analysis(
            args.project,
            args.table_project_id,
            args.dataset_id,
            args.table_id,
            args.topic_id,
            args.subscription_id,
            args.quasi_ids,
            timeout=args.timeout,
        )
    elif args.content == "k_anonymity_w_entity":
        k_anonymity_with_entity_id(
            args.project,
            args.source_table_project_id,
            args.source_dataset_id,
            args.source_table_id,
            args.entity_id,
            args.quasi_ids,
            args.output_table_project_id,
            args.output_dataset_id,
            args.output_table_id,
        )
    elif args.content == "l_diversity":
        l_diversity_analysis(
            args.project,
            args.table_project_id,
            args.dataset_id,
            args.table_id,
            args.topic_id,
            args.subscription_id,
            args.sensitive_attribute,
            args.quasi_ids,
            timeout=args.timeout,
        )
    elif args.content == "k_map":
        k_map_estimate_analysis(
            args.project,
            args.table_project_id,
            args.dataset_id,
            args.table_id,
            args.topic_id,
            args.subscription_id,
            args.quasi_ids,
            args.info_types,
            region_code=args.region_code,
            timeout=args.timeout,
        )
