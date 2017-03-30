SELECT  COALESCE(ids.ID, a.ID, b.ID, c.ID) AS [ID],
        [#List Impressions],
        [#Details Views],
        [#Conversions],
        CASE
          WHEN [Click Rate 7 Days] > 1.0 THEN 1.0
          ELSE ROUND([Click Rate 7 Days] * 100, 2)
        END AS [Click Rate 7 Days],
        CASE
          WHEN [Click Rate 7 Days] > 1.0 THEN 1.0
          ELSE ROUND([Conversion Rate 7 Days] * 100, 2)
        END AS [Conversion Rate 7 Days],
        CASE
          WHEN [Click Rate 7 Days] > 1.0 THEN 1.0
          ELSE ROUND([Conversion Rate 14 Days] * 100, 2)
        END AS [Conversion Rate 14 Days]
FROM
(SELECT id as [ID] FROM track GROUP BY id) AS ids
LEFT OUTER JOIN
(SELECT id as [ID],
        SUM(CASE eventtype WHEN "list" THEN 1 ELSE 0 END) AS [#List Impressions],
        SUM(CASE eventtype WHEN "details" THEN 1 ELSE 0 END) AS [#Details Views],
        SUM(CASE eventtype WHEN "conversion" THEN 1 ELSE 0 END) AS [#Conversions]
  FROM track
  WHERE inserted_at < $date AND inserted_at >= $dateMinusOneDay
  GROUP BY id) AS a
ON ids.ID = a.ID
LEFT OUTER JOIN
(SELECT id as [ID],
        1.0 *
        SUM(CASE eventtype WHEN "list" THEN 1 ELSE 0 END) / -- [#List Impressions]
        SUM(CASE eventtype WHEN "details" THEN 1 ELSE 0 END) -- [#Details Views]
        AS [Click Rate 7 Days],
        1.0 *
        SUM(CASE eventtype WHEN "conversion" THEN 1 ELSE 0 END) / -- [#Conversions]
        (SUM(CASE eventtype WHEN "list" THEN 1 ELSE 0 END) + --[#List Impressions]
        SUM(CASE eventtype WHEN "details" THEN 1 ELSE 0 END)) -- [#Details Views]
        AS [Conversion Rate 7 Days]
  FROM track
  WHERE inserted_at < $date AND inserted_at >= $dateMinusOneWeek
  GROUP BY id) AS b
ON ids.ID = b.ID
LEFT OUTER JOIN
(SELECT id as [ID],
        1.0 *
        SUM(CASE eventtype WHEN "conversion" THEN 1 ELSE 0 END) / -- [#Conversions]
        (SUM(CASE eventtype WHEN "list" THEN 1 ELSE 0 END) + --[#List Impressions]
        SUM(CASE eventtype WHEN "details" THEN 1 ELSE 0 END)) -- [#Details Views]
        AS [Conversion Rate 14 Days]
  FROM track
  WHERE inserted_at < $date AND inserted_at >= $dateMinusTwoWeeks
  GROUP BY id) AS c
ON ids.ID = c.ID
WHERE A.ID IS NOT NULL