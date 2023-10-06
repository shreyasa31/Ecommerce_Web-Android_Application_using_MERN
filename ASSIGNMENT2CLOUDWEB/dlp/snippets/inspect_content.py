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

"""Sample app that uses the Data Loss Prevention API to inspect a string, a
local file or a file on Google Cloud Storage."""


import argparse
import json
import os

# [START dlp_inspect_phone_number]
import google.cloud.dlp


def inspect_phone_number(
    project: str,
    content_string: str,
) -> None:
    """Uses the Data Loss Prevention API to analyze strings for protected data.
    Args:
        project: The Google Cloud project id to use as a parent resource.
        content_string: The string to inspect phone number from.
    """

    # Instantiate a client.
    dlp = google.cloud.dlp_v2.DlpServiceClient()

    # Prepare info_types by converting the list of strings into a list of
    # dictionaries (protos are also accepted).
    info_types = [{"name": "PHONE_NUMBER"}]

    # Construct the configuration dictionary.
    inspect_config = {
        "info_types": info_types,
        "include_quote": True,
    }

    # Construct the `item`.
    item = {"value": content_string}

    # Convert the project id into a full resource id.
    parent = f"projects/{project}"

    # Call the API.
    response = dlp.inspect_content(
        request={"parent": parent, "inspect_config": inspect_config, "item": item}
    )

    # Print out the results.
    if response.result.findings:
        for finding in response.result.findings:
            print(f"Quote: {finding.quote}")
            print(f"Info type: {finding.info_type.name}")
            print(f"Likelihood: {finding.likelihood}")
    else:
        print("No findings.")


# [END dlp_inspect_phone_number]


# [START dlp_inspect_string]
from typing import List  # noqa: E402, I100

import google.cloud.dlp  # noqa: F811, E402


def inspect_string(
    project: str,
    content_string: str,
    info_types: List[str],
    custom_dictionaries: List[str] = None,
    custom_regexes: List[str] = None,
    min_likelihood: str = None,
    max_findings: str = None,
    include_quote: str = True,
) -> None:
    """Uses the Data Loss Prevention API to analyze strings for protected data.
    Args:
        project: The Google Cloud project id to use as a parent resource.
        content_string: The string to inspect.
        info_types: A list of strings representing info types to look for.
            A full list of info type categories can be fetched from the API.
        min_likelihood: A string representing the minimum likelihood threshold
            that constitutes a match. One of: 'LIKELIHOOD_UNSPECIFIED',
            'VERY_UNLIKELY', 'UNLIKELY', 'POSSIBLE', 'LIKELY', 'VERY_LIKELY'.
        max_findings: The maximum number of findings to report; 0 = no maximum.
        include_quote: Boolean for whether to display a quote of the detected
            information in the results.
    Returns:
        None; the response from the API is printed to the terminal.
    """

    # Instantiate a client.
    dlp = google.cloud.dlp_v2.DlpServiceClient()

    # Prepare info_types by converting the list of strings into a list of
    # dictionaries (protos are also accepted).
    info_types = [{"name": info_type} for info_type in info_types]

    # Prepare custom_info_types by parsing the dictionary word lists and
    # regex patterns.
    if custom_dictionaries is None:
        custom_dictionaries = []
    dictionaries = [
        {
            "info_type": {"name": f"CUSTOM_DICTIONARY_{i}"},
            "dictionary": {"word_list": {"words": custom_dict.split(",")}},
        }
        for i, custom_dict in enumerate(custom_dictionaries)
    ]
    if custom_regexes is None:
        custom_regexes = []
    regexes = [
        {
            "info_type": {"name": f"CUSTOM_REGEX_{i}"},
            "regex": {"pattern": custom_regex},
        }
        for i, custom_regex in enumerate(custom_regexes)
    ]
    custom_info_types = dictionaries + regexes

    # Construct the configuration dictionary. Keys which are None may
    # optionally be omitted entirely.
    inspect_config = {
        "info_types": info_types,
        "custom_info_types": custom_info_types,
        "min_likelihood": min_likelihood,
        "include_quote": include_quote,
        "limits": {"max_findings_per_request": max_findings},
    }

    # Construct the `item`.
    item = {"value": content_string}

    # Convert the project id into a full resource id.
    parent = f"projects/{project}"

    # Call the API.
    response = dlp.inspect_content(
        request={"parent": parent, "inspect_config": inspect_config, "item": item}
    )

    # Print out the results.
    if response.result.findings:
        for finding in response.result.findings:
            try:
                if finding.quote:
                    print(f"Quote: {finding.quote}")
            except AttributeError:
                pass
            print(f"Info type: {finding.info_type.name}")
            print(f"Likelihood: {finding.likelihood}")
    else:
        print("No findings.")


# [END dlp_inspect_string]


# [START dlp_inspect_augment_infotypes]
from typing import List  # noqa: F811, E402, I100

import google.cloud.dlp  # noqa: F811, E402


def inspect_string_augment_infotype(
    project: str,
    input_str: str,
    info_type: str,
    word_list: List[str],
) -> None:
    """Uses the Data Loss Prevention API to augment built-in infoType
    detector and inspect the content string with augmented infoType.
    Args:
        project: The Google Cloud project id to use as a parent resource.
        input_str: The string to inspect using augmented infoType
            (will be treated as text).
        info_type: A string representing built-in infoType to augment.
            A full list of infoType categories can be fetched from the API.
        word_list: List of words or phrases to be added to extend the behaviour
            of built-in infoType.
    """

    # Instantiate a client.
    dlp = google.cloud.dlp_v2.DlpServiceClient()

    # Construct the custom infoTypes dictionary with declaration of a built-in detector.
    custom_info_types = [
        {
            "info_type": {"name": info_type},
            "dictionary": {"word_list": {"words": word_list}},
        }
    ]

    # Construct inspect configuration dictionary with the custom info type.
    inspect_config = {
        "custom_info_types": custom_info_types,
        "include_quote": True,
    }

    # Construct the `item` to be inspected.
    item = {"value": input_str}

    # Convert the project id into a full resource id.
    parent = f"projects/{project}"

    # Call the API.
    response = dlp.inspect_content(
        request={
            "parent": parent,
            "inspect_config": inspect_config,
            "item": item,
        }
    )

    # Print out the results.
    if response.result.findings:
        for finding in response.result.findings:
            print(f"Quote: {finding.quote}")
            print(f"Info type: {finding.info_type.name}")
            print(f"Likelihood: {finding.likelihood} \n")
    else:
        print("No findings.")


# [END dlp_inspect_augment_infotypes]


# [START dlp_inspect_table]
from typing import List, Optional  # noqa: E402, I100

import google.cloud.dlp  # noqa: F811, E402


def inspect_table(
    project: str,
    data: str,
    info_types: List[str],
    custom_dictionaries: List[str] = None,
    custom_regexes: List[str] = None,
    min_likelihood: Optional[str] = None,
    max_findings: Optional[int] = None,
    include_quote: bool = True,
) -> None:
    """Uses the Data Loss Prevention API to analyze strings for protected data.
    Args:
        project: The Google Cloud project id to use as a parent resource.
        data: Json string representing table data.
        info_types: A list of strings representing info types to look for.
            A full list of info type categories can be fetched from the API.
        min_likelihood: A string representing the minimum likelihood threshold
            that constitutes a match. One of: 'LIKELIHOOD_UNSPECIFIED',
            'VERY_UNLIKELY', 'UNLIKELY', 'POSSIBLE', 'LIKELY', 'VERY_LIKELY'.
        max_findings: The maximum number of findings to report; 0 = no maximum.
        include_quote: Boolean for whether to display a quote of the detected
            information in the results.
    Returns:
        None; the response from the API is printed to the terminal.
    Example:
        data = {
            "header":[
                "email",
                "phone number"
            ],
            "rows":[
                [
                    "robertfrost@xyz.com",
                    "4232342345"
                ],
                [
                    "johndoe@pqr.com",
                    "4253458383"
                ]
            ]
        }

        >> $ python inspect_content.py table \
        '{"header": ["email", "phone number"],
        "rows": [["robertfrost@xyz.com", "4232342345"],
        ["johndoe@pqr.com", "4253458383"]]}'
        >>  Quote: robertfrost@xyz.com
            Info type: EMAIL_ADDRESS
            Likelihood: 4
            Quote: johndoe@pqr.com
            Info type: EMAIL_ADDRESS
            Likelihood: 4
    """

    # Instantiate a client.
    dlp = google.cloud.dlp_v2.DlpServiceClient()

    # Prepare info_types by converting the list of strings into a list of
    # dictionaries (protos are also accepted).
    info_types = [{"name": info_type} for info_type in info_types]

    # Prepare custom_info_types by parsing the dictionary word lists and
    # regex patterns.
    if custom_dictionaries is None:
        custom_dictionaries = []
    dictionaries = [
        {
            "info_type": {"name": f"CUSTOM_DICTIONARY_{i}"},
            "dictionary": {"word_list": {"words": custom_dict.split(",")}},
        }
        for i, custom_dict in enumerate(custom_dictionaries)
    ]
    if custom_regexes is None:
        custom_regexes = []
    regexes = [
        {
            "info_type": {"name": f"CUSTOM_REGEX_{i}"},
            "regex": {"pattern": custom_regex},
        }
        for i, custom_regex in enumerate(custom_regexes)
    ]
    custom_info_types = dictionaries + regexes

    # Construct the configuration dictionary. Keys which are None may
    # optionally be omitted entirely.
    inspect_config = {
        "info_types": info_types,
        "custom_info_types": custom_info_types,
        "min_likelihood": min_likelihood,
        "include_quote": include_quote,
        "limits": {"max_findings_per_request": max_findings},
    }

    # Construct the `table`. For more details on the table schema, please see
    # https://cloud.google.com/dlp/docs/reference/rest/v2/ContentItem#Table
    headers = [{"name": val} for val in data["header"]]
    rows = []
    for row in data["rows"]:
        rows.append({"values": [{"string_value": cell_val} for cell_val in row]})

    table = {}
    table["headers"] = headers
    table["rows"] = rows
    item = {"table": table}
    # Convert the project id into a full resource id.
    parent = f"projects/{project}"

    # Call the API.
    response = dlp.inspect_content(
        request={"parent": parent, "inspect_config": inspect_config, "item": item}
    )

    # Print out the results.
    if response.result.findings:
        for finding in response.result.findings:
            try:
                if finding.quote:
                    print(f"Quote: {finding.quote}")
            except AttributeError:
                pass
            print(f"Info type: {finding.info_type.name}")
            print(f"Likelihood: {finding.likelihood}")
    else:
        print("No findings.")


# [END dlp_inspect_table]


# [START dlp_inspect_column_values_w_custom_hotwords]
from typing import List  # noqa: E402, I100

import google.cloud.dlp  # noqa: F811, E402


def inspect_column_values_w_custom_hotwords(
    project: str,
    table_header: List[str],
    table_rows: List[List[str]],
    info_types: List[str],
    custom_hotword: str,
) -> None:
    """Uses the Data Loss Prevention API to inspect table data using built-in
    infoType detectors, excluding columns that match a custom hot-word.
    Args:
        project: The Google Cloud project id to use as a parent resource.
        table_header: List of strings representing table field names.
        table_rows: List of rows representing table values.
        info_types: The infoType for which hot-word rule is applied.
        custom_hotword: The custom regular expression used for likelihood boosting.
    """

    # Instantiate a client
    dlp = google.cloud.dlp_v2.DlpServiceClient()

    # Construct the `table`. For more details on the table schema, please see
    # https://cloud.google.com/dlp/docs/reference/rest/v2/ContentItem#Table
    headers = [{"name": val} for val in table_header]
    rows = []
    for row in table_rows:
        rows.append({"values": [{"string_value": cell_val} for cell_val in row]})
    table = {"headers": headers, "rows": rows}

    # Construct the `item` for table to be inspected.
    item = {"table": table}

    # Prepare info_types by converting the list of strings into a list of
    # dictionaries.
    info_types = [{"name": info_type} for info_type in info_types]

    # Construct a rule set with caller provided hot-word, with a likelihood
    # boost to VERY_UNLIKELY when the hot-word are present
    hotword_rule = {
        "hotword_regex": {"pattern": custom_hotword},
        "likelihood_adjustment": {
            "fixed_likelihood": google.cloud.dlp_v2.Likelihood.VERY_UNLIKELY
        },
        "proximity": {"window_before": 1},
    }

    rule_set = [
        {
            "info_types": info_types,
            "rules": [{"hotword_rule": hotword_rule}],
        }
    ]

    # Construct the configuration dictionary, which defines the entire inspect content task.
    inspect_config = {
        "info_types": info_types,
        "rule_set": rule_set,
        "min_likelihood": google.cloud.dlp_v2.Likelihood.POSSIBLE,
        "include_quote": True,
    }

    # Convert the project id into a full resource id.
    parent = f"projects/{project}/locations/global"

    # Call the API
    response = dlp.inspect_content(
        request={
            "parent": parent,
            "inspect_config": inspect_config,
            "item": item,
        }
    )

    # Print out the results.
    if response.result.findings:
        for finding in response.result.findings:
            try:
                if finding.quote:
                    print("Quote: {}".format(finding.quote))
            except AttributeError:
                pass
            print("Info type: {}".format(finding.info_type.name))
            print("Likelihood: {}".format(finding.likelihood))
    else:
        print("No findings.")


# [END dlp_inspect_column_values_w_custom_hotwords]


# [START dlp_inspect_file]
import mimetypes  # noqa: I100, E402
from typing import Optional  # noqa: I100, E402


import google.cloud.dlp  # noqa: F811, E402


def inspect_file(
    project: str,
    filename: str,
    info_types: List[str],
    min_likelihood: str = None,
    custom_dictionaries: List[str] = None,
    custom_regexes: List[str] = None,
    max_findings: Optional[int] = None,
    include_quote: bool = True,
    mime_type: str = None,
) -> None:
    """Uses the Data Loss Prevention API to analyze a file for protected data.
    Args:
        project: The Google Cloud project id to use as a parent resource.
        filename: The path to the file to inspect.
        info_types: A list of strings representing info types to look for.
            A full list of info type categories can be fetched from the API.
        min_likelihood: A string representing the minimum likelihood threshold
            that constitutes a match. One of: 'LIKELIHOOD_UNSPECIFIED',
            'VERY_UNLIKELY', 'UNLIKELY', 'POSSIBLE', 'LIKELY', 'VERY_LIKELY'.
        max_findings: The maximum number of findings to report; 0 = no maximum.
        include_quote: Boolean for whether to display a quote of the detected
            information in the results.
        mime_type: The MIME type of the file. If not specified, the type is
            inferred via the Python standard library's mimetypes module.
    Returns:
        None; the response from the API is printed to the terminal.
    """

    # Instantiate a client.
    dlp = google.cloud.dlp_v2.DlpServiceClient()

    # Prepare info_types by converting the list of strings into a list of
    # dictionaries (protos are also accepted).
    if not info_types:
        info_types = ["FIRST_NAME", "LAST_NAME", "EMAIL_ADDRESS"]
    info_types = [{"name": info_type} for info_type in info_types]

    # Prepare custom_info_types by parsing the dictionary word lists and
    # regex patterns.
    if custom_dictionaries is None:
        custom_dictionaries = []
    dictionaries = [
        {
            "info_type": {"name": f"CUSTOM_DICTIONARY_{i}"},
            "dictionary": {"word_list": {"words": custom_dict.split(",")}},
        }
        for i, custom_dict in enumerate(custom_dictionaries)
    ]
    if custom_regexes is None:
        custom_regexes = []
    regexes = [
        {
            "info_type": {"name": f"CUSTOM_REGEX_{i}"},
            "regex": {"pattern": custom_regex},
        }
        for i, custom_regex in enumerate(custom_regexes)
    ]
    custom_info_types = dictionaries + regexes

    # Construct the configuration dictionary. Keys which are None may
    # optionally be omitted entirely.
    inspect_config = {
        "info_types": info_types,
        "custom_info_types": custom_info_types,
        "min_likelihood": min_likelihood,
        "include_quote": include_quote,
        "limits": {"max_findings_per_request": max_findings},
    }

    # If mime_type is not specified, guess it from the filename.
    if mime_type is None:
        mime_guess = mimetypes.MimeTypes().guess_type(filename)
        mime_type = mime_guess[0]

    # Select the content type index from the list of supported types.
    supported_content_types = {
        None: 0,  # "Unspecified"
        "image/jpeg": 1,
        "image/bmp": 2,
        "image/png": 3,
        "image/svg": 4,
        "text/plain": 5,
    }
    content_type_index = supported_content_types.get(mime_type, 0)

    # Construct the item, containing the file's byte data.
    with open(filename, mode="rb") as f:
        item = {"byte_item": {"type_": content_type_index, "data": f.read()}}

    # Convert the project id into a full resource id.
    parent = f"projects/{project}"

    # Call the API.
    response = dlp.inspect_content(
        request={"parent": parent, "inspect_config": inspect_config, "item": item}
    )

    # Print out the results.
    if response.result.findings:
        for finding in response.result.findings:
            try:
                print(f"Quote: {finding.quote}")
            except AttributeError:
                pass
            print(f"Info type: {finding.info_type.name}")
            print(f"Likelihood: {finding.likelihood}")
    else:
        print("No findings.")


# [END dlp_inspect_file]


# [START dlp_inspect_gcs]
import threading  # noqa: F811, E402, I100
from typing import Optional  # noqa: I100, E402

import google.cloud.dlp  # noqa: F811, E402
import google.cloud.pubsub  # noqa: F811, E402


def inspect_gcs_file(
    project: str,
    bucket: str,
    filename: str,
    topic_id: str,
    subscription_id: str,
    info_types: List[str],
    custom_dictionaries: List[str] = None,
    custom_regexes: List[str] = None,
    min_likelihood: Optional[str] = None,
    max_findings: Optional[int] = None,
    timeout: int = 300,
) -> None:
    """Uses the Data Loss Prevention API to analyze a file on GCS.
    Args:
        project: The Google Cloud project id to use as a parent resource.
        bucket: The name of the GCS bucket containing the file, as a string.
        filename: The name of the file in the bucket, including the path, as a
            string; e.g. 'images/myfile.png'.
        topic_id: The id of the Cloud Pub/Sub topic to which the API will
            broadcast job completion. The topic must already exist.
        subscription_id: The id of the Cloud Pub/Sub subscription to listen on
            while waiting for job completion. The subscription must already
            exist and be subscribed to the topic.
        info_types: A list of strings representing info types to look for.
            A full list of info type categories can be fetched from the API.
        min_likelihood: A string representing the minimum likelihood threshold
            that constitutes a match. One of: 'LIKELIHOOD_UNSPECIFIED',
            'VERY_UNLIKELY', 'UNLIKELY', 'POSSIBLE', 'LIKELY', 'VERY_LIKELY'.
        max_findings: The maximum number of findings to report; 0 = no maximum.
        timeout: The number of seconds to wait for a response from the API.
    Returns:
        None; the response from the API is printed to the terminal.
    """

    # Instantiate a client.
    dlp = google.cloud.dlp_v2.DlpServiceClient()

    # Prepare info_types by converting the list of strings into a list of
    # dictionaries (protos are also accepted).
    if not info_types:
        info_types = ["FIRST_NAME", "LAST_NAME", "EMAIL_ADDRESS"]
    info_types = [{"name": info_type} for info_type in info_types]

    # Prepare custom_info_types by parsing the dictionary word lists and
    # regex patterns.
    if custom_dictionaries is None:
        custom_dictionaries = []
    dictionaries = [
        {
            "info_type": {"name": f"CUSTOM_DICTIONARY_{i}"},
            "dictionary": {"word_list": {"words": custom_dict.split(",")}},
        }
        for i, custom_dict in enumerate(custom_dictionaries)
    ]
    if custom_regexes is None:
        custom_regexes = []
    regexes = [
        {
            "info_type": {"name": f"CUSTOM_REGEX_{i}"},
            "regex": {"pattern": custom_regex},
        }
        for i, custom_regex in enumerate(custom_regexes)
    ]
    custom_info_types = dictionaries + regexes

    # Construct the configuration dictionary. Keys which are None may
    # optionally be omitted entirely.
    inspect_config = {
        "info_types": info_types,
        "custom_info_types": custom_info_types,
        "min_likelihood": min_likelihood,
        "limits": {"max_findings_per_request": max_findings},
    }

    # Construct a storage_config containing the file's URL.
    url = f"gs://{bucket}/{filename}"
    storage_config = {"cloud_storage_options": {"file_set": {"url": url}}}

    # Convert the project id into full resource ids.
    topic = google.cloud.pubsub.PublisherClient.topic_path(project, topic_id)
    parent = f"projects/{project}/locations/global"

    # Tell the API where to send a notification when the job is complete.
    actions = [{"pub_sub": {"topic": topic}}]

    # Construct the inspect_job, which defines the entire inspect content task.
    inspect_job = {
        "inspect_config": inspect_config,
        "storage_config": storage_config,
        "actions": actions,
    }

    operation = dlp.create_dlp_job(
        request={"parent": parent, "inspect_job": inspect_job}
    )
    print(f"Inspection operation started: {operation.name}")

    # Create a Pub/Sub client and find the subscription. The subscription is
    # expected to already be listening to the topic.
    subscriber = google.cloud.pubsub.SubscriberClient()
    subscription_path = subscriber.subscription_path(project, subscription_id)

    # Set up a callback to acknowledge a message. This closes around an event
    # so that it can signal that it is done and the main thread can continue.
    job_done = threading.Event()

    def callback(message: google.cloud.pubsub_v1.subscriber.message.Message) -> None:
        try:
            if message.attributes["DlpJobName"] == operation.name:
                # This is the message we're looking for, so acknowledge it.
                message.ack()

                # Now that the job is done, fetch the results and print them.
                job = dlp.get_dlp_job(request={"name": operation.name})
                print(f"Job name: {job.name}")
                if job.inspect_details.result.info_type_stats:
                    for finding in job.inspect_details.result.info_type_stats:
                        print(
                            "Info type: {}; Count: {}".format(
                                finding.info_type.name, finding.count
                            )
                        )
                else:
                    print("No findings.")

                # Signal to the main thread that we can exit.
                job_done.set()
            else:
                # This is not the message we're looking for.
                message.drop()
        except Exception as e:
            # Because this is executing in a thread, an exception won't be
            # noted unless we print it manually.
            print(e)
            raise

    subscriber.subscribe(subscription_path, callback=callback)
    finished = job_done.wait(timeout=timeout)
    if not finished:
        print(
            "No event received before the timeout. Please verify that the "
            "subscription provided is subscribed to the topic provided."
        )


# [END dlp_inspect_gcs]


# [START dlp_inspect_datastore]
import threading  # noqa: F811, E402, I100
from typing import List, Optional  # noqa: E402, I100

import google.cloud.dlp  # noqa: F811, E402
import google.cloud.pubsub  # noqa: F811, E402


def inspect_datastore(
    project: str,
    datastore_project: str,
    kind: str,
    topic_id: str,
    subscription_id: str,
    info_types: List[str],
    custom_dictionaries: List[str] = None,
    custom_regexes: List[str] = None,
    namespace_id: str = None,
    min_likelihood: Optional[int] = None,
    max_findings: Optional[int] = None,
    timeout: int = 300,
) -> None:
    """Uses the Data Loss Prevention API to analyze Datastore data.
    Args:
        project: The Google Cloud project id to use as a parent resource.
        datastore_project: The Google Cloud project id of the target Datastore.
        kind: The kind of the Datastore entity to inspect, e.g. 'Person'.
        topic_id: The id of the Cloud Pub/Sub topic to which the API will
            broadcast job completion. The topic must already exist.
        subscription_id: The id of the Cloud Pub/Sub subscription to listen on
            while waiting for job completion. The subscription must already
            exist and be subscribed to the topic.
        info_types: A list of strings representing info types to look for.
            A full list of info type categories can be fetched from the API.
        namespace_id: The namespace of the Datastore document, if applicable.
        min_likelihood: A string representing the minimum likelihood threshold
            that constitutes a match. One of: 'LIKELIHOOD_UNSPECIFIED',
            'VERY_UNLIKELY', 'UNLIKELY', 'POSSIBLE', 'LIKELY', 'VERY_LIKELY'.
        max_findings: The maximum number of findings to report; 0 = no maximum.
        timeout: The number of seconds to wait for a response from the API.
    Returns:
        None; the response from the API is printed to the terminal.
    """

    # Instantiate a client.
    dlp = google.cloud.dlp_v2.DlpServiceClient()

    # Prepare info_types by converting the list of strings into a list of
    # dictionaries (protos are also accepted).
    if not info_types:
        info_types = ["FIRST_NAME", "LAST_NAME", "EMAIL_ADDRESS"]
    info_types = [{"name": info_type} for info_type in info_types]

    # Prepare custom_info_types by parsing the dictionary word lists and
    # regex patterns.
    if custom_dictionaries is None:
        custom_dictionaries = []
    dictionaries = [
        {
            "info_type": {"name": f"CUSTOM_DICTIONARY_{i}"},
            "dictionary": {"word_list": {"words": custom_dict.split(",")}},
        }
        for i, custom_dict in enumerate(custom_dictionaries)
    ]
    if custom_regexes is None:
        custom_regexes = []
    regexes = [
        {
            "info_type": {"name": f"CUSTOM_REGEX_{i}"},
            "regex": {"pattern": custom_regex},
        }
        for i, custom_regex in enumerate(custom_regexes)
    ]
    custom_info_types = dictionaries + regexes

    # Construct the configuration dictionary. Keys which are None may
    # optionally be omitted entirely.
    inspect_config = {
        "info_types": info_types,
        "custom_info_types": custom_info_types,
        "min_likelihood": min_likelihood,
        "limits": {"max_findings_per_request": max_findings},
    }

    # Construct a storage_config containing the target Datastore info.
    storage_config = {
        "datastore_options": {
            "partition_id": {
                "project_id": datastore_project,
                "namespace_id": namespace_id,
            },
            "kind": {"name": kind},
        }
    }

    # Convert the project id into full resource ids.
    topic = google.cloud.pubsub.PublisherClient.topic_path(project, topic_id)
    parent = f"projects/{project}/locations/global"

    # Tell the API where to send a notification when the job is complete.
    actions = [{"pub_sub": {"topic": topic}}]

    # Construct the inspect_job, which defines the entire inspect content task.
    inspect_job = {
        "inspect_config": inspect_config,
        "storage_config": storage_config,
        "actions": actions,
    }

    operation = dlp.create_dlp_job(
        request={"parent": parent, "inspect_job": inspect_job}
    )
    print(f"Inspection operation started: {operation.name}")

    # Create a Pub/Sub client and find the subscription. The subscription is
    # expected to already be listening to the topic.
    subscriber = google.cloud.pubsub.SubscriberClient()
    subscription_path = subscriber.subscription_path(project, subscription_id)

    # Set up a callback to acknowledge a message. This closes around an event
    # so that it can signal that it is done and the main thread can continue.
    job_done = threading.Event()

    def callback(message: google.cloud.pubsub_v1.subscriber.message.Message) -> None:
        try:
            if message.attributes["DlpJobName"] == operation.name:
                # This is the message we're looking for, so acknowledge it.
                message.ack()

                # Now that the job is done, fetch the results and print them.
                job = dlp.get_dlp_job(request={"name": operation.name})
                print(f"Job name: {job.name}")
                if job.inspect_details.result.info_type_stats:
                    for finding in job.inspect_details.result.info_type_stats:
                        print(
                            "Info type: {}; Count: {}".format(
                                finding.info_type.name, finding.count
                            )
                        )
                else:
                    print("No findings.")

                # Signal to the main thread that we can exit.
                job_done.set()
            else:
                # This is not the message we're looking for.
                message.drop()
        except Exception as e:
            # Because this is executing in a thread, an exception won't be
            # noted unless we print it manually.
            print(e)
            raise

    # Register the callback and wait on the event.
    subscriber.subscribe(subscription_path, callback=callback)

    finished = job_done.wait(timeout=timeout)
    if not finished:
        print(
            "No event received before the timeout. Please verify that the "
            "subscription provided is subscribed to the topic provided."
        )


# [END dlp_inspect_datastore]


# [START dlp_inspect_bigquery]
import threading  # noqa: F811, E402, I100
from typing import List, Optional  # noqa: E402

import google.cloud.dlp  # noqa: F811, E402
import google.cloud.pubsub  # noqa: F811, E402


def inspect_bigquery(
    project: str,
    bigquery_project: str,
    dataset_id: str,
    table_id: str,
    topic_id: str,
    subscription_id: str,
    info_types: List[str],
    custom_dictionaries: List[str] = None,
    custom_regexes: List[str] = None,
    min_likelihood: Optional[int] = None,
    max_findings: Optional[int] = None,
    timeout: int = 500,
) -> None:
    """Uses the Data Loss Prevention API to analyze BigQuery data.
    Args:
        project: The Google Cloud project id to use as a parent resource.
        bigquery_project: The Google Cloud project id of the target table.
        dataset_id: The id of the target BigQuery dataset.
        table_id: The id of the target BigQuery table.
        topic_id: The id of the Cloud Pub/Sub topic to which the API will
            broadcast job completion. The topic must already exist.
        subscription_id: The id of the Cloud Pub/Sub subscription to listen on
            while waiting for job completion. The subscription must already
            exist and be subscribed to the topic.
        info_types: A list of strings representing info types to look for.
            A full list of info type categories can be fetched from the API.
        namespace_id: The namespace of the Datastore document, if applicable.
        min_likelihood: A string representing the minimum likelihood threshold
            that constitutes a match. One of: 'LIKELIHOOD_UNSPECIFIED',
            'VERY_UNLIKELY', 'UNLIKELY', 'POSSIBLE', 'LIKELY', 'VERY_LIKELY'.
        max_findings: The maximum number of findings to report; 0 = no maximum.
        timeout: The number of seconds to wait for a response from the API.
    Returns:
        None; the response from the API is printed to the terminal.
    """

    # Instantiate a client.
    dlp = google.cloud.dlp_v2.DlpServiceClient()

    # Prepare info_types by converting the list of strings into a list of
    # dictionaries (protos are also accepted).
    if not info_types:
        info_types = ["FIRST_NAME", "LAST_NAME", "EMAIL_ADDRESS"]
    info_types = [{"name": info_type} for info_type in info_types]

    # Prepare custom_info_types by parsing the dictionary word lists and
    # regex patterns.
    if custom_dictionaries is None:
        custom_dictionaries = []
    dictionaries = [
        {
            "info_type": {"name": f"CUSTOM_DICTIONARY_{i}"},
            "dictionary": {"word_list": {"words": custom_dict.split(",")}},
        }
        for i, custom_dict in enumerate(custom_dictionaries)
    ]
    if custom_regexes is None:
        custom_regexes = []
    regexes = [
        {
            "info_type": {"name": f"CUSTOM_REGEX_{i}"},
            "regex": {"pattern": custom_regex},
        }
        for i, custom_regex in enumerate(custom_regexes)
    ]
    custom_info_types = dictionaries + regexes

    # Construct the configuration dictionary. Keys which are None may
    # optionally be omitted entirely.
    inspect_config = {
        "info_types": info_types,
        "custom_info_types": custom_info_types,
        "min_likelihood": min_likelihood,
        "limits": {"max_findings_per_request": max_findings},
    }

    # Construct a storage_config containing the target Bigquery info.
    storage_config = {
        "big_query_options": {
            "table_reference": {
                "project_id": bigquery_project,
                "dataset_id": dataset_id,
                "table_id": table_id,
            }
        }
    }

    # Convert the project id into full resource ids.
    topic = google.cloud.pubsub.PublisherClient.topic_path(project, topic_id)
    parent = f"projects/{project}/locations/global"

    # Tell the API where to send a notification when the job is complete.
    actions = [{"pub_sub": {"topic": topic}}]

    # Construct the inspect_job, which defines the entire inspect content task.
    inspect_job = {
        "inspect_config": inspect_config,
        "storage_config": storage_config,
        "actions": actions,
    }

    operation = dlp.create_dlp_job(
        request={"parent": parent, "inspect_job": inspect_job}
    )
    print(f"Inspection operation started: {operation.name}")

    # Create a Pub/Sub client and find the subscription. The subscription is
    # expected to already be listening to the topic.
    subscriber = google.cloud.pubsub.SubscriberClient()
    subscription_path = subscriber.subscription_path(project, subscription_id)

    # Set up a callback to acknowledge a message. This closes around an event
    # so that it can signal that it is done and the main thread can continue.
    job_done = threading.Event()

    def callback(message: google.cloud.pubsub_v1.subscriber.message.Message) -> None:
        try:
            if message.attributes["DlpJobName"] == operation.name:
                # This is the message we're looking for, so acknowledge it.
                message.ack()

                # Now that the job is done, fetch the results and print them.
                job = dlp.get_dlp_job(request={"name": operation.name})
                print(f"Job name: {job.name}")
                if job.inspect_details.result.info_type_stats:
                    for finding in job.inspect_details.result.info_type_stats:
                        print(
                            "Info type: {}; Count: {}".format(
                                finding.info_type.name, finding.count
                            )
                        )
                else:
                    print("No findings.")

                # Signal to the main thread that we can exit.
                job_done.set()
            else:
                # This is not the message we're looking for.
                message.drop()
        except Exception as e:
            # Because this is executing in a thread, an exception won't be
            # noted unless we print it manually.
            print(e)
            raise

    # Register the callback and wait on the event.
    subscriber.subscribe(subscription_path, callback=callback)
    finished = job_done.wait(timeout=timeout)
    if not finished:
        print(
            "No event received before the timeout. Please verify that the "
            "subscription provided is subscribed to the topic provided."
        )


# [END dlp_inspect_bigquery]


# [START dlp_inspect_image_all_infotypes]
import google.cloud.dlp  # noqa: F811, E402, I100


def inspect_image_file_all_infotypes(
    project: str,
    filename: str,
    include_quote: bool = True,
) -> None:
    """Uses the Data Loss Prevention API to analyze strings for protected data in image file.
    Args:
        project: The Google Cloud project id to use as a parent resource.
        filename: The path to the file to inspect.
        include_quote: Boolean for whether to display a quote of the detected
            information in the results.

    Returns:
        None; the response from the API is printed to the terminal.
    """

    # Instantiate a client.
    dlp = google.cloud.dlp_v2.DlpServiceClient()

    # Construct the byte_item, containing the image file's byte data.
    with open(filename, mode="rb") as f:
        byte_item = {"type_": "IMAGE", "data": f.read()}

    # Convert the project id into a full resource id.
    parent = f"projects/{project}"

    # Call the API.
    response = dlp.inspect_content(
        request={
            "parent": parent,
            "inspect_config": {"include_quote": include_quote},
            "item": {"byte_item": byte_item},
        }
    )

    # Print out the results.
    print("Findings: ", response.result.findings.count)
    if response.result.findings:
        for finding in response.result.findings:
            print(f"Quote: {finding.quote}")
            print(f"Info type: {finding.info_type.name}")
            print(f"Likelihood: {finding.likelihood}")
    else:
        print("No findings.")


# [END dlp_inspect_image_all_infotypes]


# [START dlp_inspect_image_file]
import google.cloud.dlp  # noqa: F811, E402, I100


def inspect_image_file(
    project: str,
    filename: str,
    include_quote: bool = True,
) -> None:
    """Uses the Data Loss Prevention API to analyze strings for
    protected data in image file.
    Args:
        project: The Google Cloud project id to use as a parent resource.
        filename: The path to the file to inspect.
        include_quote: Boolean for whether to display a quote of the detected
            information in the results.
    """
    # Instantiate a client.
    dlp = google.cloud.dlp_v2.DlpServiceClient()

    # Prepare info_types by converting the list of strings into a list of
    # dictionaries.
    info_types = ["PHONE_NUMBER", "EMAIL_ADDRESS", "CREDIT_CARD_NUMBER"]
    info_types = [{"name": info_type} for info_type in info_types]

    # Construct the configuration for the Inspect request.
    inspect_config = {
        "info_types": info_types,
        "include_quote": include_quote,
    }

    # Construct the byte_item, containing the image file's byte data.
    with open(filename, mode="rb") as f:
        byte_item = {"type_": "IMAGE", "data": f.read()}

    # Convert the project id into a full resource id.
    parent = f"projects/{project}/locations/global"

    # Call the API.
    response = dlp.inspect_content(
        request={
            "parent": parent,
            "inspect_config": inspect_config,
            "item": {"byte_item": byte_item},
        }
    )

    # Parse the response and process results.
    if response.result.findings:
        for finding in response.result.findings:
            print("Quote: {}".format(finding.quote))
            print("Info type: {}".format(finding.info_type.name))
            print("Likelihood: {}".format(finding.likelihood))
    else:
        print("No findings.")


# [END dlp_inspect_image_file]


# [START dlp_inspect_image_listed_infotypes]
import google.cloud.dlp  # noqa: F811, E402


def inspect_image_file_listed_infotypes(
    project: str,
    filename: str,
    info_types: List[str],
    include_quote: bool = True,
) -> None:
    """Uses the Data Loss Prevention API to analyze strings in an image for
    data matching the given infoTypes.
    Args:
        project: The Google Cloud project id to use as a parent resource.
        filename: The path of the image file to inspect.
        info_types:  A list of strings representing infoTypes to look for.
            A full list of info type categories can be fetched from the API.
        include_quote: Boolean for whether to display a matching snippet of
            the detected information in the results.
    """

    # Instantiate a client.
    dlp = google.cloud.dlp_v2.DlpServiceClient()

    # Prepare info_types by converting the list of strings into a list of
    # dictionaries.
    info_types = [{"name": info_type} for info_type in info_types]

    # Construct the configuration dictionary.
    inspect_config = {
        "info_types": info_types,
        "include_quote": include_quote,
    }

    # Construct the byte_item, containing the image file's byte data.
    with open(filename, mode="rb") as f:
        byte_item = {"type_": "IMAGE", "data": f.read()}

    # Convert the project id into a full resource id.
    parent = f"projects/{project}"

    # Call the API.
    response = dlp.inspect_content(
        request={
            "parent": parent,
            "inspect_config": inspect_config,
            "item": {"byte_item": byte_item},
        }
    )

    # Print out the results.
    if response.result.findings:
        for finding in response.result.findings:
            print("Info type: {}".format(finding.info_type.name))
            if include_quote:
                print("Quote: {}".format(finding.quote))
            print("Likelihood: {} \n".format(finding.likelihood))
    else:
        print("No findings.")


# [END dlp_inspect_image_listed_infotypes]


# [START dlp_inspect_bigquery_with_sampling]
import threading  # noqa: F811, E402, I100

import google.cloud.dlp  # noqa: F811, E402
import google.cloud.pubsub  # noqa: F811, E402


def inspect_bigquery_table_with_sampling(
    project: str,
    topic_id: str,
    subscription_id: str,
    min_likelihood: str = None,
    max_findings: str = None,
    timeout: int = 300,
) -> None:
    """Uses the Data Loss Prevention API to analyze BigQuery data by limiting
    the amount of data to be scanned.
    Args:
        project: The Google Cloud project id to use as a parent resource.
        topic_id: The id of the Cloud Pub/Sub topic to which the API will
            broadcast job completion. The topic must already exist.
        subscription_id: The id of the Cloud Pub/Sub subscription to listen on
            while waiting for job completion. The subscription must already
            exist and be subscribed to the topic.
        min_likelihood: A string representing the minimum likelihood threshold
            that constitutes a match. One of: 'LIKELIHOOD_UNSPECIFIED',
            'VERY_UNLIKELY', 'UNLIKELY', 'POSSIBLE', 'LIKELY', 'VERY_LIKELY'.
        max_findings: The maximum number of findings to report; 0 = no maximum.
        timeout: The number of seconds to wait for a response from the API.
    """

    # Instantiate a client.
    dlp = google.cloud.dlp_v2.DlpServiceClient()

    # Specify how the content should be inspected. Keys which are None may
    # optionally be omitted entirely.
    inspect_config = {
        "info_types": [{"name": "PERSON_NAME"}],
        "min_likelihood": min_likelihood,
        "limits": {"max_findings_per_request": max_findings},
        "include_quote": True,
    }

    # Specify the BigQuery table to be inspected.
    # Here we are using public bigquery table.
    table_reference = {
        "project_id": "bigquery-public-data",
        "dataset_id": "usa_names",
        "table_id": "usa_1910_current",
    }

    # Construct a storage_config containing the target BigQuery info.
    storage_config = {
        "big_query_options": {
            "table_reference": table_reference,
            "rows_limit": 1000,
            "sample_method": "RANDOM_START",
            "identifying_fields": [{"name": "name"}],
        }
    }

    # Tell the API where to send a notification when the job is complete.
    topic = google.cloud.pubsub.PublisherClient.topic_path(project, topic_id)
    actions = [{"pub_sub": {"topic": topic}}]

    # Construct the inspect_job, which defines the entire inspect content task.
    inspect_job = {
        "inspect_config": inspect_config,
        "storage_config": storage_config,
        "actions": actions,
    }

    # Convert the project id into full resource ids.
    parent = f"projects/{project}/locations/global"

    # Call the API
    operation = dlp.create_dlp_job(
        request={"parent": parent, "inspect_job": inspect_job}
    )
    print(f"Inspection operation started: {operation.name}")

    # Create a Pub/Sub client and find the subscription. The subscription is
    # expected to already be listening to the topic.
    subscriber = google.cloud.pubsub.SubscriberClient()
    subscription_path = subscriber.subscription_path(project, subscription_id)

    # Set up a callback to acknowledge a message. This closes around an event
    # so that it can signal that it is done and the main thread can continue.
    job_done = threading.Event()

    def callback(message: google.cloud.pubsub_v1.subscriber.message.Message) -> None:
        try:
            if message.attributes["DlpJobName"] == operation.name:
                # This is the message we're looking for, so acknowledge it.
                message.ack()

                # Now that the job is done, fetch the results and print them.
                job = dlp.get_dlp_job(request={"name": operation.name})
                print(f"Job name: {job.name}")

                if job.inspect_details.result.info_type_stats:
                    for finding in job.inspect_details.result.info_type_stats:
                        print(
                            "Info type: {}; Count: {}".format(
                                finding.info_type.name, finding.count
                            )
                        )
                else:
                    print("No findings.")

                # Signal to the main thread that we can exit.
                job_done.set()
            else:
                # This is not the message we're looking for.
                message.drop()

        except Exception as e:
            # Because this is executing in a thread, an exception won't be
            # noted unless we print it manually.
            print(e)
            raise

    # Register the callback and wait on the event.
    subscriber.subscribe(subscription_path, callback=callback)
    finished = job_done.wait(timeout=timeout)
    if not finished:
        print(
            "No event received before the timeout. Please verify that the "
            "subscription provided is subscribed to the topic provided."
        )


# [END dlp_inspect_bigquery_with_sampling]


# [START dlp_inspect_gcs_with_sampling]
import threading  # noqa: F811, E402, I100

import google.cloud.dlp  # noqa: F811, E402
import google.cloud.pubsub  # noqa: F811, E402


def inspect_gcs_with_sampling(
    project: str,
    bucket: str,
    topic_id: str,
    subscription_id: str,
    info_types: List[str] = None,
    file_types: List[str] = None,
    min_likelihood: str = None,
    max_findings: int = None,
    timeout: int = 300,
) -> None:
    """Uses the Data Loss Prevention API to analyze files in GCS by
    limiting the amount of data to be scanned.
    Args:
        project: The Google Cloud project id to use as a parent resource.
        bucket: The name of the GCS bucket containing the file, as a string.
        topic_id: The id of the Cloud Pub/Sub topic to which the API will
            broadcast job completion. The topic must already exist.
        subscription_id: The id of the Cloud Pub/Sub subscription to listen on
            while waiting for job completion. The subscription must already
            exist and be subscribed to the topic.
        info_types: A list of strings representing infoTypes to look for.
            A full list of info type categories can be fetched from the API.
        file_types: Type of files in gcs bucket where the inspection would happen.
        min_likelihood: A string representing the minimum likelihood threshold
            that constitutes a match. One of: 'LIKELIHOOD_UNSPECIFIED',
            'VERY_UNLIKELY', 'UNLIKELY', 'POSSIBLE', 'LIKELY', 'VERY_LIKELY'.
        max_findings: The maximum number of findings to report; 0 = no maximum.
        timeout: The number of seconds to wait for a response from the API.
    """

    # Instantiate a client.
    dlp = google.cloud.dlp_v2.DlpServiceClient()

    # Prepare info_types by converting the list of strings into a list of
    # dictionaries.
    if not info_types:
        info_types = ["FIRST_NAME", "LAST_NAME", "EMAIL_ADDRESS"]
    info_types = [{"name": info_type} for info_type in info_types]

    # Specify how the content should be inspected. Keys which are None may
    # optionally be omitted entirely.
    inspect_config = {
        "info_types": info_types,
        "exclude_info_types": True,
        "include_quote": True,
        "min_likelihood": min_likelihood,
        "limits": {"max_findings_per_request": max_findings},
    }

    # Setting default file types as CSV files
    if not file_types:
        file_types = ["CSV"]

    # Construct a cloud_storage_options dictionary with the bucket's URL.
    url = "gs://{}/*".format(bucket)
    storage_config = {
        "cloud_storage_options": {
            "file_set": {"url": url},
            "bytes_limit_per_file": 200,
            "file_types": file_types,
            "files_limit_percent": 90,
            "sample_method": "RANDOM_START",
        }
    }

    # Tell the API where to send a notification when the job is complete.
    topic = google.cloud.pubsub.PublisherClient.topic_path(project, topic_id)
    actions = [{"pub_sub": {"topic": topic}}]

    # Construct the inspect_job, which defines the entire inspect content task.
    inspect_job = {
        "inspect_config": inspect_config,
        "storage_config": storage_config,
        "actions": actions,
    }

    # Convert the project id into full resource ids.
    parent = f"projects/{project}/locations/global"

    # Call the API
    operation = dlp.create_dlp_job(
        request={"parent": parent, "inspect_job": inspect_job}
    )
    print("Inspection operation started: {}".format(operation.name))

    # Create a Pub/Sub client and find the subscription. The subscription is
    # expected to already be listening to the topic.
    subscriber = google.cloud.pubsub.SubscriberClient()
    subscription_path = subscriber.subscription_path(project, subscription_id)

    # Set up a callback to acknowledge a message. This closes around an event
    # so that it can signal that it is done and the main thread can continue.
    job_done = threading.Event()

    def callback(message):
        try:
            if message.attributes["DlpJobName"] == operation.name:
                # This is the message we're looking for, so acknowledge it.
                message.ack()

                # Now that the job is done, fetch the results and print them.
                job = dlp.get_dlp_job(request={"name": operation.name})
                print(f"Job name: {job.name}")
                if job.inspect_details.result.info_type_stats:
                    print("Findings:")
                    for finding in job.inspect_details.result.info_type_stats:
                        print(
                            "Info type: {}; Count: {}".format(
                                finding.info_type.name, finding.count
                            )
                        )
                else:
                    print("No findings.")

                # Signal to the main thread that we can exit.
                job_done.set()
            else:
                # This is not the message we're looking for.
                message.drop()
        except Exception as e:
            # Because this is executing in a thread, an exception won't be
            # noted unless we print it manually.
            print(e)
            raise

    # Register the callback and wait on the event.
    subscriber.subscribe(subscription_path, callback=callback)
    finished = job_done.wait(timeout=timeout)
    if not finished:
        print(
            "No event received before the timeout. Please verify that the "
            "subscription provided is subscribed to the topic provided."
        )


# [END dlp_inspect_gcs_with_sampling]


# [START dlp_inspect_send_data_to_hybrid_job_trigger]
import time  # noqa: F811, E402, I100

import google.cloud.dlp  # noqa: F811, E402


def inspect_data_to_hybrid_job_trigger(
    project: str,
    trigger_id: str,
    content_string: str,
) -> None:
    """
    Uses the Data Loss Prevention API to inspect sensitive information
    using Hybrid jobs trigger that scans payloads of data sent from
    virtually any source and stores findings in Google Cloud.
    Args:
        project: The Google Cloud project id to use as a parent resource.
        trigger_id: The job trigger identifier for hybrid job trigger.
        content_string: The string to inspect.
    """

    # Instantiate a client.
    dlp = google.cloud.dlp_v2.DlpServiceClient()

    # Construct the `item` to inspect.
    item = {"value": content_string}

    # Construct the container details that contains metadata to be
    # associated with the content. For more details, please refer to
    # https://cloud.google.com/dlp/docs/reference/rest/v2/Container
    container_details = {
        "full_path": "10.0.0.2:logs1:app1",
        "relative_path": "app1",
        "root_path": "10.0.0.2:logs1",
        "type_": "logging_sys",
        "version": "1.2",
    }

    # Construct hybrid inspection configuration.
    hybrid_config = {
        "item": item,
        "finding_details": {
            "container_details": container_details,
            "labels": {
                "env": "prod",
                "appointment-bookings-comments": "",
            },
        },
    }

    # Convert the trigger id into a full resource id.
    trigger_id = f"projects/{project}/jobTriggers/{trigger_id}"

    # Activate the job trigger.
    dlp_job = dlp.activate_job_trigger(request={"name": trigger_id})

    # Call the API.
    dlp.hybrid_inspect_job_trigger(
        request={
            "name": trigger_id,
            "hybrid_item": hybrid_config,
        }
    )

    # Get inspection job details.
    job = dlp.get_dlp_job(request={"name": dlp_job.name})

    # Wait for dlp job to get finished.
    while job.inspect_details.result.processed_bytes <= 0:
        time.sleep(5)
        job = dlp.get_dlp_job(request={"name": dlp_job.name})

    # Print the results.
    print(f"Job name: {dlp_job.name}")
    if job.inspect_details.result.info_type_stats:
        for finding in job.inspect_details.result.info_type_stats:
            print(
                "Info type: {}; Count: {}".format(finding.info_type.name, finding.count)
            )
    else:
        print("No findings.")


# [END dlp_inspect_send_data_to_hybrid_job_trigger]


# [START dlp_inspect_gcs_send_to_scc]
import time  # noqa: F811, E402, I100
from typing import List  # noqa: F811, E402, I100

import google.cloud.dlp  # noqa: F811, E402


def inspect_gcs_send_to_scc(
    project: str,
    bucket: str,
    info_types: List[str],
    max_findings: int = 100,
) -> None:
    """
    Uses the Data Loss Prevention API to inspect Google Cloud Storage
    data and send the results to Google Security Command Center.
    Args:
        project: The Google Cloud project id to use as a parent resource.
        bucket: The name of the GCS bucket containing the file, as a string.
        info_types: A list of strings representing infoTypes to inspect for.
            A full list of infoType categories can be fetched from the API.
        max_findings: The maximum number of findings to report; 0 = no maximum.
    """
    # Instantiate a client.
    dlp = google.cloud.dlp_v2.DlpServiceClient()

    # Prepare info_types by converting the list of strings into a list of
    # dictionaries.
    info_types = [{"name": info_type} for info_type in info_types]

    # Construct the configuration dictionary.
    inspect_config = {
        "info_types": info_types,
        "min_likelihood": google.cloud.dlp_v2.Likelihood.UNLIKELY,
        "limits": {"max_findings_per_request": max_findings},
        "include_quote": True,
    }

    # Construct a cloud_storage_options dictionary with the bucket's URL.
    url = f"gs://{bucket}"
    storage_config = {"cloud_storage_options": {"file_set": {"url": url}}}

    # Tell the API where to send a notification when the job is complete.
    actions = [{"publish_summary_to_cscc": {}}]

    # Construct the job definition.
    job = {
        "inspect_config": inspect_config,
        "storage_config": storage_config,
        "actions": actions,
    }

    # Convert the project id into a full resource id.
    parent = f"projects/{project}"

    # Call the API.
    response = dlp.create_dlp_job(
        request={
            "parent": parent,
            "inspect_job": job,
        }
    )
    print("Inspection Job started : {}".format(response.name))

    job_name = response.name

    # Waiting for maximum 15 minutes for the job to get complete.
    no_of_attempts = 30
    while no_of_attempts > 0:
        # Get the DLP job status.
        job = dlp.get_dlp_job(request={"name": job_name})
        # Check if the job has completed.
        if job.state == google.cloud.dlp_v2.DlpJob.JobState.DONE:
            break
        elif job.state == google.cloud.dlp_v2.DlpJob.JobState.FAILED:
            print("Job Failed, Please check the configuration.")
            return

        # Sleep for a short duration before checking the job status again.
        time.sleep(30)
        no_of_attempts -= 1

    # Print out the results.
    print(f"Job name: {job.name}")
    result = job.inspect_details.result
    print("Processed Bytes: ", result.processed_bytes)
    if result.info_type_stats:
        for stats in result.info_type_stats:
            print("Info type: {}".format(stats.info_type.name))
            print("Count: {}".format(stats.count))
    else:
        print("No findings.")


# [END dlp_inspect_gcs_send_to_scc]


# [START dlp_inspect_datastore_send_to_scc]
import time  # noqa: F811, E402, I100
from typing import List  # noqa: F811, E402, I100

import google.cloud.dlp  # noqa: F811, E402


def inspect_datastore_send_to_scc(
    project: str,
    datastore_project: str,
    kind: str,
    info_types: List[str],
    namespace_id: str = None,
    max_findings: int = 100,
) -> None:
    """
    Uses the Data Loss Prevention API to inspect Datastore data and
    send the results to Google Security Command Center.
    Args:
        project: The Google Cloud project id to use as a parent resource.
        datastore_project: The Google Cloud project id of the target Datastore.
        kind: The kind of the Datastore entity to inspect, e.g. 'Person'.
        info_types: A list of strings representing infoTypes to inspect for.
            A full list of infoType categories can be fetched from the API.
        namespace_id: The namespace of the Datastore document, if applicable.
        max_findings: The maximum number of findings to report; 0 = no maximum

    """
    # Instantiate a client.
    dlp = google.cloud.dlp_v2.DlpServiceClient()

    # Prepare info_types by converting the list of strings into a list of
    # dictionaries.
    info_types = [{"name": info_type} for info_type in info_types]

    # Construct the configuration dictionary.
    inspect_config = {
        "info_types": info_types,
        "min_likelihood": google.cloud.dlp_v2.Likelihood.UNLIKELY,
        "limits": {"max_findings_per_request": max_findings},
        "include_quote": True,
    }

    # Construct a cloud_storage_options dictionary with datastore options.
    storage_config = {
        "datastore_options": {
            "partition_id": {
                "project_id": datastore_project,
                "namespace_id": namespace_id,
            },
            "kind": {"name": kind},
        }
    }

    # Tell the API where to send a notification when the job is complete.
    actions = [{"publish_summary_to_cscc": {}}]

    # Construct the job definition.
    job = {
        "inspect_config": inspect_config,
        "storage_config": storage_config,
        "actions": actions,
    }

    # Convert the project id into a full resource id.
    parent = f"projects/{project}"

    # Call the API
    response = dlp.create_dlp_job(
        request={
            "parent": parent,
            "inspect_job": job,
        }
    )
    print("Inspection Job started : {}".format(response.name))

    job_name = response.name

    # Waiting for a maximum of 15 minutes for the job to get complete.
    no_of_attempts = 30
    while no_of_attempts > 0:
        # Get the DLP job status.
        job = dlp.get_dlp_job(request={"name": job_name})
        # Check if the job has completed.
        if job.state == google.cloud.dlp_v2.DlpJob.JobState.DONE:
            break
        elif job.state == google.cloud.dlp_v2.DlpJob.JobState.FAILED:
            print("Job Failed, Please check the configuration.")
            return

        # Sleep for a short duration before checking the job status again.
        time.sleep(30)
        no_of_attempts -= 1

    # Print out the results.
    print(f"Job name: {job.name}")
    result = job.inspect_details.result
    if result.info_type_stats:
        for stats in result.info_type_stats:
            print("Info type: {}".format(stats.info_type.name))
            print("Count: {}".format(stats.count))
    else:
        print("No findings.")


# [END dlp_inspect_datastore_send_to_scc]

# [START dlp_inspect_bigquery_send_to_scc]
import time  # noqa: F811, E402, I100
from typing import List  # noqa: F811, E402, I100

import google.cloud.dlp  # noqa: F811, E402


def inspect_bigquery_send_to_scc(
    project: str,
    info_types: List[str],
    max_findings: int = 100,
) -> None:
    """
    Uses the Data Loss Prevention API to inspect public bigquery dataset
    and send the results to Google Security Command Center.
    Args:
        project: The Google Cloud project id to use as a parent resource.
        info_types: A list of strings representing infoTypes to inspect for.
            A full list of infoType categories can be fetched from the API.
        max_findings: The maximum number of findings to report; 0 = no maximum
    """
    # Instantiate a client.
    dlp = google.cloud.dlp_v2.DlpServiceClient()

    # Prepare info_types by converting the list of strings into a list of
    # dictionaries.
    info_types = [{"name": info_type} for info_type in info_types]

    # Construct the configuration dictionary.
    inspect_config = {
        "info_types": info_types,
        "min_likelihood": google.cloud.dlp_v2.Likelihood.UNLIKELY,
        "limits": {"max_findings_per_request": max_findings},
        "include_quote": True,
    }

    # Construct a Cloud Storage Options dictionary with the big query options.
    storage_config = {
        "big_query_options": {
            "table_reference": {
                "project_id": "bigquery-public-data",
                "dataset_id": "usa_names",
                "table_id": "usa_1910_current",
            }
        }
    }

    # Tell the API where to send a notification when the job is complete.
    actions = [{"publish_summary_to_cscc": {}}]

    # Construct the job definition.
    job = {
        "inspect_config": inspect_config,
        "storage_config": storage_config,
        "actions": actions,
    }

    # Convert the project id into a full resource id.
    parent = f"projects/{project}"

    # Call the API.
    response = dlp.create_dlp_job(
        request={
            "parent": parent,
            "inspect_job": job,
        }
    )
    print("Inspection Job started : {}".format(response.name))

    job_name = response.name

    # Waiting for a maximum of 15 minutes for the job to get complete.
    no_of_attempts = 30
    while no_of_attempts > 0:
        # Get the DLP job status.
        job = dlp.get_dlp_job(request={"name": job_name})
        # Check if the job has completed.
        if job.state == google.cloud.dlp_v2.DlpJob.JobState.DONE:
            break
        elif job.state == google.cloud.dlp_v2.DlpJob.JobState.FAILED:
            print("Job Failed, Please check the configuration.")
            return

        # Sleep for a short duration before checking the job status again.
        time.sleep(30)
        no_of_attempts -= 1

    # Print out the results.
    print(f"Job name: {job.name}")
    result = job.inspect_details.result
    if result.info_type_stats:
        for stats in result.info_type_stats:
            print("Info type: {}".format(stats.info_type.name))
            print("Count: {}".format(stats.count))
    else:
        print("No findings.")


# [END dlp_inspect_bigquery_send_to_scc]


if __name__ == "__main__":
    default_project = os.environ.get("GOOGLE_CLOUD_PROJECT")

    parser = argparse.ArgumentParser(description=__doc__)
    subparsers = parser.add_subparsers(
        dest="content", help="Select how to submit content to the API."
    )
    subparsers.required = True

    parser_phone_number = subparsers.add_parser(
        "phone_number",
        help="Inspect phone number in a string.",
    )
    parser_phone_number.add_argument(
        "content_string",
        help="The string to inspect phone number from.",
    )
    parser_phone_number.add_argument(
        "--project",
        help="The Google Cloud project id to use as a parent resource.",
        default=default_project,
    )

    parser_string = subparsers.add_parser("string", help="Inspect a string.")
    parser_string.add_argument("item", help="The string to inspect.")
    parser_string.add_argument(
        "--project",
        help="The Google Cloud project id to use as a parent resource.",
        default=default_project,
    )
    parser_string.add_argument(
        "--info_types",
        nargs="+",
        help="Strings representing info types to look for. A full list of "
        "info categories and types is available from the API. Examples "
        'include "FIRST_NAME", "LAST_NAME", "EMAIL_ADDRESS". '
        "If unspecified, the three above examples will be used.",
        default=["FIRST_NAME", "LAST_NAME", "EMAIL_ADDRESS"],
    )
    parser_string.add_argument(
        "--custom_dictionaries",
        action="append",
        help="Strings representing comma-delimited lists of dictionary words"
        " to search for as custom info types. Each string is a comma "
        "delimited list of words representing a distinct dictionary.",
        default=None,
    )
    parser_string.add_argument(
        "--custom_regexes",
        action="append",
        help="Strings representing regex patterns to search for as custom "
        " info types.",
        default=None,
    )
    parser_string.add_argument(
        "--min_likelihood",
        choices=[
            "LIKELIHOOD_UNSPECIFIED",
            "VERY_UNLIKELY",
            "UNLIKELY",
            "POSSIBLE",
            "LIKELY",
            "VERY_LIKELY",
        ],
        help="A string representing the minimum likelihood threshold that "
        "constitutes a match.",
    )
    parser_string.add_argument(
        "--max_findings",
        type=int,
        help="The maximum number of findings to report; 0 = no maximum.",
    )
    parser_string.add_argument(
        "--include_quote",
        type=bool,
        help="A boolean for whether to display a quote of the detected "
        "information in the results.",
        default=True,
    )

    parser_augment_infotype = subparsers.add_parser(
        "augment_infotype",
        help="Augment infoType and inspect a string using augmented infoType.",
    )
    parser_augment_infotype.add_argument(
        "--project",
        help="The Google Cloud project id to use as a parent resource.",
        default=default_project,
    )
    parser_augment_infotype.add_argument("input_str", help="The string to inspect.")
    parser_augment_infotype.add_argument(
        "--info_type",
        help="A String representing info types to look for. A full list of "
        "info categories and types is available from the API. Examples "
        'include "FIRST_NAME", "LAST_NAME", "EMAIL_ADDRESS". ',
    )
    parser_augment_infotype.add_argument(
        "--word_list",
        help="List of words or phrases to be added to extend the behaviour "
        "of built-in infoType.",
    )

    parser_table = subparsers.add_parser("table", help="Inspect a table.")
    parser_table.add_argument(
        "data", help="Json string representing a table.", type=json.loads
    )
    parser_table.add_argument(
        "--project",
        help="The Google Cloud project id to use as a parent resource.",
        default=default_project,
    )
    parser_table.add_argument(
        "--info_types",
        action="append",
        help="Strings representing info types to look for. A full list of "
        "info categories and types is available from the API. Examples "
        'include "FIRST_NAME", "LAST_NAME", "EMAIL_ADDRESS". '
        "If unspecified, the three above examples will be used.",
        default=["FIRST_NAME", "LAST_NAME", "EMAIL_ADDRESS"],
    )
    parser_table.add_argument(
        "--custom_dictionaries",
        action="append",
        help="Strings representing comma-delimited lists of dictionary words"
        " to search for as custom info types. Each string is a comma "
        "delimited list of words representing a distinct dictionary.",
        default=None,
    )
    parser_table.add_argument(
        "--custom_regexes",
        action="append",
        help="Strings representing regex patterns to search for as custom "
        " info types.",
        default=None,
    )
    parser_table.add_argument(
        "--min_likelihood",
        choices=[
            "LIKELIHOOD_UNSPECIFIED",
            "VERY_UNLIKELY",
            "UNLIKELY",
            "POSSIBLE",
            "LIKELY",
            "VERY_LIKELY",
        ],
        help="A string representing the minimum likelihood threshold that "
        "constitutes a match.",
    )
    parser_table.add_argument(
        "--max_findings",
        type=int,
        help="The maximum number of findings to report; 0 = no maximum.",
    )
    parser_table.add_argument(
        "--include_quote",
        type=bool,
        help="A boolean for whether to display a quote of the detected "
        "information in the results.",
        default=True,
    )

    parser_table_hotword = subparsers.add_parser(
        "table_w_custom_hotword",
        help="Inspect a table and exclude column values when matched "
        "with custom hot-word.",
    )
    parser_table_hotword.add_argument(
        "--project",
        help="The Google Cloud project id to use as a parent resource.",
        default=default_project,
    )
    parser_table_hotword.add_argument(
        "--table_header",
        help="List of strings representing table field names."
        "Example include '['Fake_Email_Address', 'Real_Email_Address]'. "
        "The method can be used to exclude matches from entire column"
        '"Fake_Email_Address".',
    )
    parser_table_hotword.add_argument(
        "--table_rows",
        help="List of rows representing table values."
        "Example: "
        '"[["example1@example.org", "test1@example.com],'
        '["example2@example.org", "test2@example.com]]"',
    )
    parser_table_hotword.add_argument(
        "--info_types",
        action="append",
        help="Strings representing info types to look for. A full list of "
        "info categories and types is available from the API. Examples "
        'include "FIRST_NAME", "LAST_NAME", "EMAIL_ADDRESS". ',
    )
    parser_table_hotword.add_argument(
        "custom_hotword",
        help="The custom regular expression used for likelihood boosting.",
    )

    parser_file = subparsers.add_parser("file", help="Inspect a local file.")
    parser_file.add_argument("filename", help="The path to the file to inspect.")
    parser_file.add_argument(
        "--project",
        help="The Google Cloud project id to use as a parent resource.",
        default=default_project,
    )
    parser_file.add_argument(
        "--info_types",
        action="append",
        help="Strings representing info types to look for. A full list of "
        "info categories and types is available from the API. Examples "
        'include "FIRST_NAME", "LAST_NAME", "EMAIL_ADDRESS". '
        "If unspecified, the three above examples will be used.",
        default=["FIRST_NAME", "LAST_NAME", "EMAIL_ADDRESS"],
    )
    parser_file.add_argument(
        "--custom_dictionaries",
        action="append",
        help="Strings representing comma-delimited lists of dictionary words"
        " to search for as custom info types. Each string is a comma "
        "delimited list of words representing a distinct dictionary.",
        default=None,
    )
    parser_file.add_argument(
        "--custom_regexes",
        action="append",
        help="Strings representing regex patterns to search for as custom "
        " info types.",
        default=None,
    )
    parser_file.add_argument(
        "--min_likelihood",
        choices=[
            "LIKELIHOOD_UNSPECIFIED",
            "VERY_UNLIKELY",
            "UNLIKELY",
            "POSSIBLE",
            "LIKELY",
            "VERY_LIKELY",
        ],
        help="A string representing the minimum likelihood threshold that "
        "constitutes a match.",
    )
    parser_file.add_argument(
        "--max_findings",
        type=int,
        help="The maximum number of findings to report; 0 = no maximum.",
    )
    parser_file.add_argument(
        "--include_quote",
        type=bool,
        help="A boolean for whether to display a quote of the detected "
        "information in the results.",
        default=True,
    )
    parser_file.add_argument(
        "--mime_type",
        help="The MIME type of the file. If not specified, the type is "
        "inferred via the Python standard library's mimetypes module.",
    )

    parser_gcs = subparsers.add_parser(
        "gcs", help="Inspect files on Google Cloud Storage."
    )
    parser_gcs.add_argument(
        "bucket", help="The name of the GCS bucket containing the file."
    )
    parser_gcs.add_argument(
        "filename",
        help="The name of the file in the bucket, including the path, e.g. "
        '"images/myfile.png". Wildcards are permitted.',
    )
    parser_gcs.add_argument(
        "topic_id",
        help="The id of the Cloud Pub/Sub topic to use to report that the job "
        'is complete, e.g. "dlp-sample-topic".',
    )
    parser_gcs.add_argument(
        "subscription_id",
        help="The id of the Cloud Pub/Sub subscription to monitor for job "
        'completion, e.g. "dlp-sample-subscription". The subscription must '
        "already be subscribed to the topic. See the test files or the Cloud "
        "Pub/Sub sample files for examples on how to create the subscription.",
    )
    parser_gcs.add_argument(
        "--project",
        help="The Google Cloud project id to use as a parent resource.",
        default=default_project,
    )
    parser_gcs.add_argument(
        "--info_types",
        action="append",
        help="Strings representing info types to look for. A full list of "
        "info categories and types is available from the API. Examples "
        'include "FIRST_NAME", "LAST_NAME", "EMAIL_ADDRESS". '
        "If unspecified, the three above examples will be used.",
        default=["FIRST_NAME", "LAST_NAME", "EMAIL_ADDRESS"],
    )
    parser_gcs.add_argument(
        "--custom_dictionaries",
        action="append",
        help="Strings representing comma-delimited lists of dictionary words"
        " to search for as custom info types. Each string is a comma "
        "delimited list of words representing a distinct dictionary.",
        default=None,
    )
    parser_gcs.add_argument(
        "--custom_regexes",
        action="append",
        help="Strings representing regex patterns to search for as custom "
        " info types.",
        default=None,
    )
    parser_gcs.add_argument(
        "--min_likelihood",
        choices=[
            "LIKELIHOOD_UNSPECIFIED",
            "VERY_UNLIKELY",
            "UNLIKELY",
            "POSSIBLE",
            "LIKELY",
            "VERY_LIKELY",
        ],
        help="A string representing the minimum likelihood threshold that "
        "constitutes a match.",
    )
    parser_gcs.add_argument(
        "--max_findings",
        type=int,
        help="The maximum number of findings to report; 0 = no maximum.",
    )
    parser_gcs.add_argument(
        "--timeout",
        type=int,
        help="The maximum number of seconds to wait for a response from the "
        "API. The default is 300 seconds.",
        default=300,
    )

    parser_datastore = subparsers.add_parser(
        "datastore", help="Inspect files on Google Datastore."
    )
    parser_datastore.add_argument(
        "datastore_project",
        help="The Google Cloud project id of the target Datastore.",
    )
    parser_datastore.add_argument(
        "kind",
        help='The kind of the Datastore entity to inspect, e.g. "Person".',
    )
    parser_datastore.add_argument(
        "topic_id",
        help="The id of the Cloud Pub/Sub topic to use to report that the job "
        'is complete, e.g. "dlp-sample-topic".',
    )
    parser_datastore.add_argument(
        "subscription_id",
        help="The id of the Cloud Pub/Sub subscription to monitor for job "
        'completion, e.g. "dlp-sample-subscription". The subscription must '
        "already be subscribed to the topic. See the test files or the Cloud "
        "Pub/Sub sample files for examples on how to create the subscription.",
    )
    parser_datastore.add_argument(
        "--project",
        help="The Google Cloud project id to use as a parent resource.",
        default=default_project,
    )
    parser_datastore.add_argument(
        "--info_types",
        action="append",
        help="Strings representing info types to look for. A full list of "
        "info categories and types is available from the API. Examples "
        'include "FIRST_NAME", "LAST_NAME", "EMAIL_ADDRESS". '
        "If unspecified, the three above examples will be used.",
        default=["FIRST_NAME", "LAST_NAME", "EMAIL_ADDRESS"],
    )
    parser_datastore.add_argument(
        "--custom_dictionaries",
        action="append",
        help="Strings representing comma-delimited lists of dictionary words"
        " to search for as custom info types. Each string is a comma "
        "delimited list of words representing a distinct dictionary.",
        default=None,
    )
    parser_datastore.add_argument(
        "--custom_regexes",
        action="append",
        help="Strings representing regex patterns to search for as custom "
        " info types.",
        default=None,
    )
    parser_datastore.add_argument(
        "--namespace_id", help="The Datastore namespace to use, if applicable."
    )
    parser_datastore.add_argument(
        "--min_likelihood",
        choices=[
            "LIKELIHOOD_UNSPECIFIED",
            "VERY_UNLIKELY",
            "UNLIKELY",
            "POSSIBLE",
            "LIKELY",
            "VERY_LIKELY",
        ],
        help="A string representing the minimum likelihood threshold that "
        "constitutes a match.",
    )
    parser_datastore.add_argument(
        "--max_findings",
        type=int,
        help="The maximum number of findings to report; 0 = no maximum.",
    )
    parser_datastore.add_argument(
        "--timeout",
        type=int,
        help="The maximum number of seconds to wait for a response from the "
        "API. The default is 300 seconds.",
        default=300,
    )

    parser_bigquery = subparsers.add_parser(
        "bigquery", help="Inspect files on Google BigQuery."
    )
    parser_bigquery.add_argument(
        "bigquery_project",
        help="The Google Cloud project id of the target table.",
    )
    parser_bigquery.add_argument(
        "dataset_id", help="The ID of the target BigQuery dataset."
    )
    parser_bigquery.add_argument(
        "table_id", help="The ID of the target BigQuery table."
    )
    parser_bigquery.add_argument(
        "topic_id",
        help="The id of the Cloud Pub/Sub topic to use to report that the job "
        'is complete, e.g. "dlp-sample-topic".',
    )
    parser_bigquery.add_argument(
        "subscription_id",
        help="The id of the Cloud Pub/Sub subscription to monitor for job "
        'completion, e.g. "dlp-sample-subscription". The subscription must '
        "already be subscribed to the topic. See the test files or the Cloud "
        "Pub/Sub sample files for examples on how to create the subscription.",
    )
    parser_bigquery.add_argument(
        "--project",
        help="The Google Cloud project id to use as a parent resource.",
        default=default_project,
    )
    parser_bigquery.add_argument(
        "--info_types",
        nargs="+",
        help="Strings representing info types to look for. A full list of "
        "info categories and types is available from the API. Examples "
        'include "FIRST_NAME", "LAST_NAME", "EMAIL_ADDRESS". '
        "If unspecified, the three above examples will be used.",
        default=["FIRST_NAME", "LAST_NAME", "EMAIL_ADDRESS"],
    )
    parser_bigquery.add_argument(
        "--custom_dictionaries",
        action="append",
        help="Strings representing comma-delimited lists of dictionary words"
        " to search for as custom info types. Each string is a comma "
        "delimited list of words representing a distinct dictionary.",
        default=None,
    )
    parser_bigquery.add_argument(
        "--custom_regexes",
        action="append",
        help="Strings representing regex patterns to search for as custom "
        " info types.",
        default=None,
    )
    parser_bigquery.add_argument(
        "--min_likelihood",
        choices=[
            "LIKELIHOOD_UNSPECIFIED",
            "VERY_UNLIKELY",
            "UNLIKELY",
            "POSSIBLE",
            "LIKELY",
            "VERY_LIKELY",
        ],
        help="A string representing the minimum likelihood threshold that "
        "constitutes a match.",
    )
    parser_bigquery.add_argument(
        "--max_findings",
        type=int,
        help="The maximum number of findings to report; 0 = no maximum.",
    )
    parser_bigquery.add_argument(
        "--timeout",
        type=int,
        help="The maximum number of seconds to wait for a response from the "
        "API. The default is 300 seconds.",
        default=300,
    )

    parser_bigquery_with_sampling = subparsers.add_parser(
        "bigquery_with_sampling",
        help="Inspect files on Google BigQuery by limiting the amount of "
        "data to be scanned.",
    )
    parser_bigquery_with_sampling.add_argument(
        "topic_id",
        help="The id of the Cloud Pub/Sub topic to use to report that the job "
        'is complete, e.g. "dlp-sample-topic".',
    )
    parser_bigquery_with_sampling.add_argument(
        "subscription_id",
        help="The id of the Cloud Pub/Sub subscription to monitor for job "
        'completion, e.g. "dlp-sample-subscription". The subscription must '
        "already be subscribed to the topic. See the test files or the Cloud "
        "Pub/Sub sample files for examples on how to create the subscription.",
    )
    parser_bigquery_with_sampling.add_argument(
        "--project",
        help="The Google Cloud project id to use as a parent resource.",
        default=default_project,
    )
    parser_bigquery_with_sampling.add_argument(
        "--min_likelihood",
        choices=[
            "LIKELIHOOD_UNSPECIFIED",
            "VERY_UNLIKELY",
            "UNLIKELY",
            "POSSIBLE",
            "LIKELY",
            "VERY_LIKELY",
        ],
        help="A string representing the minimum likelihood threshold that "
        "constitutes a match.",
    )
    parser_bigquery_with_sampling.add_argument(
        "--max_findings",
        type=int,
        help="The maximum number of findings to report; 0 = no maximum.",
    )
    parser_bigquery_with_sampling.add_argument(
        "--timeout",
        type=int,
        help="The maximum number of seconds to wait for a response from the "
        "API. The default is 300 seconds.",
        default=300,
    )

    parser_image_file = subparsers.add_parser(
        "image_all_infotypes", help="Inspect a local file with all info types."
    )
    parser_image_file.add_argument(
        "--project",
        help="The Google Cloud project id to use as a parent resource.",
        default=default_project,
    )
    parser_image_file.add_argument("filename", help="The path to the file to inspect.")
    parser_image_file.add_argument(
        "--include_quote",
        help="A Boolean for whether to display a quote of the detected"
        "information in the results.",
        default=True,
    )

    parser_image_default_infotypes = subparsers.add_parser(
        "image_default_infotypes", help="Inspect a local file with default info types."
    )
    parser_image_default_infotypes.add_argument(
        "--project",
        help="The Google Cloud project id to use as a parent resource.",
        default=default_project,
    )
    parser_image_default_infotypes.add_argument(
        "filename", help="The path to the file to inspect."
    )
    parser_image_default_infotypes.add_argument(
        "--include_quote",
        help="A Boolean for whether to display a quote of the detected"
        "information in the results.",
        default=True,
    )

    parser_image_infotypes = subparsers.add_parser(
        "image_listed_infotypes", help="Inspect a local file with listed info types."
    )
    parser_image_infotypes.add_argument(
        "--project",
        help="The Google Cloud project id to use as a parent resource.",
        default=default_project,
    )
    parser_image_infotypes.add_argument(
        "filename", help="The path to the file to inspect."
    )
    parser_image_infotypes.add_argument(
        "--info_types",
        nargs="+",
        help="Strings representing info types to look for. A full list of "
        "info categories and types is available from the API. Examples "
        'include "FIRST_NAME", "LAST_NAME", "EMAIL_ADDRESS". ',
    )
    parser_image_infotypes.add_argument(
        "--include_quote",
        help="A Boolean for whether to display a quote of the detected"
        "information in the results.",
        default=True,
    )

    parser_gcs_with_sampling = subparsers.add_parser(
        "gcs_with_sampling",
        help="Inspect files on Google Cloud Storage by limiting the "
        "amount of data to be scanned.",
    )
    parser_gcs_with_sampling.add_argument(
        "bucket",
        help="The name of the GCS bucket containing the files to inspect.",
    )
    parser_gcs_with_sampling.add_argument(
        "topic_id",
        help="The id of the Cloud Pub/Sub topic to use to report that the job "
        'is complete, e.g. "dlp-sample-topic".',
    )
    parser_gcs_with_sampling.add_argument(
        "subscription_id",
        help="The id of the Cloud Pub/Sub subscription to monitor for job "
        'completion, e.g. "dlp-sample-subscription". The subscription must '
        "already be subscribed to the topic. See the test files or the Cloud "
        "Pub/Sub sample files for examples on how to create the subscription.",
    )
    parser_gcs_with_sampling.add_argument(
        "--project",
        help="The Google Cloud project id to use as a parent resource.",
        default=default_project,
    )
    parser_gcs_with_sampling.add_argument(
        "--info_types",
        action="append",
        help="Strings representing infoTypes to look for. A full list of "
        "info categories and types is available from the API. Examples "
        'include "FIRST_NAME", "LAST_NAME", "EMAIL_ADDRESS". '
        "If unspecified, the three above examples will be used.",
        default=["FIRST_NAME", "LAST_NAME", "EMAIL_ADDRESS"],
    )
    parser_gcs_with_sampling.add_argument(
        "--file_types",
        help="List of extensions of the files in the bucket to inspect, "
        "e.g. ['CSV']",
        default=["CSV"],
    )
    parser_gcs_with_sampling.add_argument(
        "--min_likelihood",
        choices=[
            "LIKELIHOOD_UNSPECIFIED",
            "VERY_UNLIKELY",
            "UNLIKELY",
            "POSSIBLE",
            "LIKELY",
            "VERY_LIKELY",
        ],
        help="A string representing the minimum likelihood threshold that "
        "constitutes a match.",
    )
    parser_gcs_with_sampling.add_argument(
        "--max_findings",
        type=int,
        help="The maximum number of findings to report; 0 = no maximum.",
    )
    parser_gcs_with_sampling.add_argument(
        "--timeout",
        type=int,
        help="The maximum number of seconds to wait for a response from the "
        "API. The default is 300 seconds.",
        default=300,
    )

    parser_hybrid_job_trigger = subparsers.add_parser(
        "hybrid_job_trigger",
        help="Inspect sensitive information from virtually any source.",
    )
    parser_hybrid_job_trigger.add_argument(
        "--project",
        help="The Google Cloud project id to use as a parent resource.",
        default=default_project,
    )
    parser_hybrid_job_trigger.add_argument(
        "--trigger_id",
        help="The job trigger identifier for hybrid job trigger.",
    )
    parser_hybrid_job_trigger.add_argument(
        "content_string", help="The string to inspect."
    )

    parser_gcs_scc = subparsers.add_parser(
        "gcs_send_scc",
        help="Inspect gcs data and send results to SCC.",
    )
    parser_gcs_scc.add_argument(
        "--project",
        help="The Google Cloud project id to use as a parent resource.",
        default=default_project,
    )
    parser_gcs_scc.add_argument(
        "bucket",
        help="The name of the GCS bucket containing the files to inspect.",
    )
    parser_gcs_scc.add_argument(
        "--info_types",
        action="append",
        help="Strings representing infoTypes to look for. A full list of "
        "info categories and types is available from the API. Examples "
        'include "FIRST_NAME", "LAST_NAME", "EMAIL_ADDRESS".',
    )
    parser_gcs_scc.add_argument(
        "--max_findings",
        type=int,
        help="The maximum number of findings to report; 0 = no maximum.",
    )

    parser_datastore_scc = subparsers.add_parser(
        "datastore_send_scc",
        help="Inspect datastore and send results to SCC.",
    )
    parser_datastore_scc.add_argument(
        "--project",
        help="The Google Cloud project id to use as a parent resource.",
        default=default_project,
    )
    parser_datastore_scc.add_argument(
        "datastore_project",
        help="The Google Cloud project id of the target Datastore.",
    )
    parser_datastore_scc.add_argument(
        "kind",
        help='The kind of the Datastore entity to inspect, e.g. "Person".',
    )
    parser_datastore_scc.add_argument(
        "--namespace_id", help="The Datastore namespace to use, if applicable."
    )
    parser_datastore_scc.add_argument(
        "--info_types",
        action="append",
        help="Strings representing infoTypes to look for. A full list of "
        "info categories and types is available from the API. Examples "
        'include "FIRST_NAME", "LAST_NAME", "EMAIL_ADDRESS".',
    )
    parser_datastore_scc.add_argument(
        "--max_findings",
        type=int,
        help="The maximum number of findings to report; 0 = no maximum.",
    )

    parser_bigquery_scc = subparsers.add_parser(
        "bigquery_send_scc",
        help="Inspect datastore and send results to SCC.",
    )
    parser_bigquery_scc.add_argument(
        "--project",
        help="The Google Cloud project id to use as a parent resource.",
        default=default_project,
    )
    parser_bigquery_scc.add_argument(
        "--info_types",
        action="append",
        help="Strings representing infoTypes to look for. A full list of "
        "info categories and types is available from the API. Examples "
        'include "FIRST_NAME", "LAST_NAME", "EMAIL_ADDRESS".',
    )
    parser_bigquery_scc.add_argument(
        "--max_findings",
        type=int,
        help="The maximum number of findings to report; 0 = no maximum.",
    )

    args = parser.parse_args()

    if args.content == "string":
        inspect_string(
            args.project,
            args.item,
            args.info_types,
            custom_dictionaries=args.custom_dictionaries,
            custom_regexes=args.custom_regexes,
            min_likelihood=args.min_likelihood,
            max_findings=args.max_findings,
            include_quote=args.include_quote,
        )
    elif args.content == "phone_number":
        inspect_phone_number(args.project, args.content_string)
    elif args.content == "augment_infotype":
        inspect_string_augment_infotype(
            args.project,
            args.input_str,
            args.info_type,
            args.word_list,
        )
    elif args.content == "table":
        inspect_table(
            args.project,
            args.data,
            args.info_types,
            custom_dictionaries=args.custom_dictionaries,
            custom_regexes=args.custom_regexes,
            min_likelihood=args.min_likelihood,
            max_findings=args.max_findings,
            include_quote=args.include_quote,
        )
    elif args.content == "table_w_custom_hotword":
        inspect_column_values_w_custom_hotwords(
            args.project,
            args.table_header,
            args.table_rows,
            args.info_types,
            args.custom_hotword,
        )
    elif args.content == "file":
        inspect_file(
            args.project,
            args.filename,
            args.info_types,
            custom_dictionaries=args.custom_dictionaries,
            custom_regexes=args.custom_regexes,
            min_likelihood=args.min_likelihood,
            max_findings=args.max_findings,
            include_quote=args.include_quote,
            mime_type=args.mime_type,
        )
    elif args.content == "gcs":
        inspect_gcs_file(
            args.project,
            args.bucket,
            args.filename,
            args.topic_id,
            args.subscription_id,
            args.info_types,
            custom_dictionaries=args.custom_dictionaries,
            custom_regexes=args.custom_regexes,
            min_likelihood=args.min_likelihood,
            max_findings=args.max_findings,
            timeout=args.timeout,
        )
    elif args.content == "datastore":
        inspect_datastore(
            args.project,
            args.datastore_project,
            args.kind,
            args.topic_id,
            args.subscription_id,
            args.info_types,
            custom_dictionaries=args.custom_dictionaries,
            custom_regexes=args.custom_regexes,
            namespace_id=args.namespace_id,
            min_likelihood=args.min_likelihood,
            max_findings=args.max_findings,
            timeout=args.timeout,
        )
    elif args.content == "bigquery":
        inspect_bigquery(
            args.project,
            args.bigquery_project,
            args.dataset_id,
            args.table_id,
            args.topic_id,
            args.subscription_id,
            args.info_types,
            custom_dictionaries=args.custom_dictionaries,
            custom_regexes=args.custom_regexes,
            min_likelihood=args.min_likelihood,
            max_findings=args.max_findings,
            timeout=args.timeout,
        )
    elif args.content == "bigquery_with_sampling":
        inspect_bigquery_table_with_sampling(
            args.project,
            args.topic_id,
            args.subscription_id,
            min_likelihood=args.min_likelihood,
            max_findings=args.max_findings,
            timeout=args.timeout,
        )

    elif args.content == "gcs_with_sampling":
        inspect_gcs_with_sampling(
            args.project,
            args.bucket,
            args.topic_id,
            args.subscription_id,
            info_types=args.info_types,
            file_types=args.file_types,
            min_likelihood=args.min_likelihood,
            max_findings=args.max_findings,
            timeout=args.timeout,
        )

    elif args.content == "image_all_infotypes":
        inspect_image_file_all_infotypes(
            args.project,
            args.filename,
            include_quote=args.include_quote,
        )
    elif args.content == "image_default_infotypes":
        inspect_image_file(
            args.project,
            args.filename,
            include_quote=args.include_quote,
        )
    elif args.content == "image_listed_infotypes":
        inspect_image_file_listed_infotypes(
            args.project,
            args.filename,
            args.info_types,
            include_quote=args.include_quote,
        )
    elif args.content == "hybrid_job_trigger":
        inspect_data_to_hybrid_job_trigger(
            args.project,
            args.trigger_id,
            args.content_string,
        )
    elif args.content == "gcs_send_scc":
        inspect_gcs_send_to_scc(
            args.project,
            args.bucket,
            args.info_types,
            max_findings=args.max_findings,
        )
    elif args.contect == "datastore_send_scc":
        inspect_datastore_send_to_scc(
            args.project,
            args.datastore_project,
            args.kind,
            args.info_types,
            args.namespace_id,
            args.max_findings,
        )
    elif args.content == "bigquery_send_scc":
        inspect_bigquery_send_to_scc(
            args.project,
            args.info_types,
            args.max_findings,
        )
